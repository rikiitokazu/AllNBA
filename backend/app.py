import sqlite3
import json
from flask import Flask, request, jsonify, session
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt, unset_jwt_cookies
from flask_cors import CORS
from stats import get_player, df2, get_name
from shotchart import main
from team import get_team, teaminfocommoner, getroster, teamfranchiseleaders
from datetime import datetime, timedelta, timezone

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'secretpassword'
jwt = JWTManager(app)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

CORS(app)


@app.route('/events/', methods = ['GET'])
def events(): 
    return df2

@app.route('/', methods = ['POST'])
def start():
    data = request.json["data"]
    return get_player(data)

@app.route('/name', methods =['POST'])
def player_name():
    data = request.json["pname"]
    return get_name(data)


@app.route('/graph', methods = ['POST'])
def graph2():
    name = request.json["name"]
    plot, fg = main(name)
    ret = {"plot": plot, "fg": fg}
    return jsonify(ret)

@app.route('/team', methods = ['POST'])
def team():
    team_name = request.json["team"]
    name = get_team(team_name)
    data = {"info": name}
    return data


@app.route('/teaminfo', methods = ['POST'])
def teaminfo():
    teaminformation = request.json["teaminformation"]
    teaminfo = teaminfocommoner(teaminformation)
    return jsonify(teaminfo)


@app.route("/teamroster", methods = ["POST"])
def roster(): 
    teamrosters = request.json["teamrostername"]
    ros = getroster(teamrosters)
    data = {"dataroster": ros}
    return jsonify(data)


@app.route("/teamfranchises", methods =["POST"])
def teamfranchise():
    franchise = request.json["teamfranchiserecord"]
    teamleaders = teamfranchiseleaders(franchise)
    data = {"tea": teamleaders}
    return jsonify(data)
    

#--------------------database-----------------------#


def db_connection(): 
    conn = None
    try:
        conn= sqlite3.connect("nba.sqlite")
    except sqlite3.error as e:
        print(e)
    return conn

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

@app.route("/nbalogin", methods =["POST"])
def login(): 
    conn = db_connection()#grabing the database connection
    cursor = conn.cursor()
    currentuser = request.json.get("user", None)
    currentpass = request.json.get("pass", None)
    cursor.execute("SELECT * FROM nbadatabase WHERE username=?", (currentuser,))
    user = cursor.fetchone()
    if user is None: 
        data = {"success": False, "handleerror": "Incorrect username"}
    elif user[3] == currentpass:
        access_token = create_access_token(identity=user[2])
        data = {"success": True, "handleerror": "success", "access_token":access_token, "username": user[2]}
    else: 
        data = {"success": False, "handleerror": "Incorrect password"}
        
    return jsonify(data); 


@app.route('/profile')
@jwt_required()
def my_profile(): 
    user = get_jwt_identity()
    conn = db_connection()
    cursor = conn.cursor()
    data = {"name": user}
    return jsonify(data)

@app.route("/logout", methods = ["POST"])
def logout(): 
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route("/nbalogin", methods = ["GET"])
def all_login(): 
    conn = db_connection()#grabing the database connection
    cursor = conn.cursor()
    cursor = cursor.execute("SELECT * FROM nbadatabase")
    users = [
        dict(id=row[0], email=row[1], username=row[2], password=row[3], score=row[4])
        for row in cursor.fetchall()
    ]
    if users is not None:
        return jsonify(users)

@app.route("/createnbalogin", methods = ["POST"])
def createlogin():
    conn = db_connection()
    cursor = conn.cursor()
    new_email = request.json["newemail"]
    new_username = request.json["newuser"]
    new_password = request.json["newpass"]
    #if the username is in the database return false
    try:
        sql = """INSERT INTO nbadatabase (email, username, password)
                        VALUES (?, ?, ?)"""
        #placeholders, parametrize query
        cursor = cursor.execute(sql, (new_email, new_username, new_password))
        conn.commit()
        return f"User with the id: {cursor.lastrowid} created successfully"
    except sqlite3.IntegrityError:
        return "Username already exists"


@app.route("/nbalogin/<id>", methods = ["GET", "PUT", "DELETE"])
def single_user(id):
    conn = db_connection()
    cursor = conn.cursor()
    user = None
    if request.method == "GET":
        cursor.execute("SELECT * FROM nbadatabase WHERE id=?", (id,))
        rows = cursor.fetchall()
        for r in rows:
            user = r
        if user is not None:
            return jsonify(user), 200
        else:
            return "Something wrong", 404
    if request.method == "PUT":
        sql = """UPDATE nbadatabase
                SET email=?,
                    username=?,
                    password=?
                WHERE id=? """

        u_email = request.form["email"]
        u_username = request.form["username"]
        u_password = request.form["password"]
        u_updated = {
            "id": id,
            "email": u_email,
            "username": u_username,
            "password": u_password,
        }
        conn.execute(sql, (u_email, u_username, u_password, id))
        conn.commit()
        return jsonify(u_updated)

    if request.method == "DELETE":
        sql = """ DELETE FROM nbadatabase WHERE id=? """
        conn.execute(sql, (id,))
        conn.commit()
        return "The user with id: {} has been deleted.".format(id), 200



#------------------database for posting--------------------------


@app.route("/posting", methods = ["POST"])
@jwt_required()
def createpost():
    conn = db_connection()
    cursor = conn.cursor()
    new_post = request.json.get("newpost", None)
    userid = get_jwt_identity()
    try:
        sql = """INSERT INTO posts (body, user_id)
                        VALUES (?, ?)"""
        #placeholders, parametrize query
        cursor.execute(sql, (new_post, userid))
        conn.commit()
        return f"Post with the user id: {userid} created successfully"
    except sqlite3.IntegrityError:
        return "Post can not be created"

@app.route("/posting", methods = ["GET"])
def allposts():
    conn = db_connection()
    cursor = conn.cursor()
    cursor = cursor.execute("SELECT * FROM posts ORDER BY date desc")
    posts = [
        dict(post_id=row[0], body=row[1], upvote=row[2], downvote=row[3], date=row[4], user_id=row[5])
        for row in cursor.fetchall()
    ]
    if posts is not None:
        return posts


@app.route("/managepost/<id>", methods = ["GET", "PUT", "DELETE"])
def updatepost(id):
    conn = db_connection()
    cursor = conn.cursor()
    user = None
    if request.method == "GET":
        cursor.execute("SELECT * FROM posts WHERE post_id=?", (id,))
        rows = cursor.fetchall()
        for r in rows:
            user = r
        if user is not None:
            return jsonify(user), 200
        else:
            return "Something wrong", 404
        
    if request.method == "PUT":
        sql = """UPDATE posts
                SET body=?,
                WHERE post_id=? """#what is duplicate of post

        u_post = request.json.get("updatedpost", None)

        u_updated = {
            "newpost": u_post
        }
        conn.execute(sql, (u_post, id))
        conn.commit()
        return jsonify(u_updated)

    if request.method == "DELETE":
        try:
            sql = """ DELETE FROM posts WHERE post_id=? """
            conn.execute(sql, (id,))
            conn.commit()
            return f"The post with id {id} has been deleted.", 200
        except sqlite3.Error:
            return "Post does not exist"



@app.route("/getposts/<userid>")
def getposts(userid): 
    conn = db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM posts WHERE user_id = ? ORDER BY date desc", (userid,))
    posts = [
        dict(post_id=row[0], body=row[1], upvote=row[2], downvote=row[3], date=row[4], user_id=row[5])
        for row in cursor.fetchall()
    ]
    if posts is None:
        return "No posts found"
    return posts
    

@app.route("/upvote", methods = ["POST"])
def manageupvote(): 
    new = request.json.get("addone", None)
    userid = request.json.get("id", None)
    conn = db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE posts SET upvote=? WHERE post_id = ?", (new+1, userid))
    conn.commit()
    return "success"
    


@app.route("/downvote", methods = ["POST"])
def managedownvote(): 
    new = request.json.get("removeone", None)
    userid = request.json.get("id", None) 
    conn = db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE posts SET downvote=? WHERE post_id = ?", (new-1, userid))
    conn.commit()
    return "success"

@app.route("/testing")
def test():
    conn = db_connection()#grabing the database connection
    cursor = conn.cursor()
    currentuser = 'user'
    currentpass = 'id56je4s'
    cursor.execute("SELECT * FROM nbadatabase WHERE username=?", (currentuser,))
    user = cursor.fetchone()
    if user is None: 
        return "false"
    if user[3] == currentpass:
        data = {"success": True, "user": user[3]}
        return jsonify(data); 
    else: 
        return "false"



if __name__ == '__main__':
    app.run(debug=True)
