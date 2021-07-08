from __init__ import create_app
from flask import request, jsonify
from database import db
import jwt
from functools import wraps
import json 

secret = "Codebrains"
app = create_app()

class Users(db.Model):  
    usuario_id = db.Column(db.String(50), primary_key=True)
    nome = db.Column(db.String(50))
    email = db.Column(db.String(50))
    senha = db.Column(db.String(50))
    papel = db.Column(db.String(50))
    created_at = db.Column(db.DateTime)
    modified_at = db.Column(db.DateTime)

def token_required(f):
  @wraps(f)
  def decorator(*args, **kwargs):

    token = None

    if 'Authorization' in request.headers:
        token = request.headers['Authorization'].split()[1]

    if not token:
        return jsonify({'message': 'a valid token is missing'})

    try:
      # data = jwt.decode(encoded, "secret", algorithms=["HS256"])
      data = jwt.decode(token, options={"verify_signature": False})
      print(data, 2999)
      current_user = Users.query.filter_by(usuario_id=data['id']).first()
      print(current_user, 3000)
    except:
      return jsonify({'message': 'token is invalid'})

    return f(current_user, *args, **kwargs)
  return decorator