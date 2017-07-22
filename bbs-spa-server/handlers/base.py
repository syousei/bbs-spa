#!/usr/bin/env python
# -*- coding: utf-8 -*-

import logging
import os
import jwt
import webapp2
from webapp2_extras import auth

CLIENT = os.environ['CLIENT']
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = os.environ['JWT_ALGORITHM']


def user_required(handler):
    def check_signin(self, *args, **kwargs):
        jwt_token = self.get_jwt_token()
        payload = self.decode_jwt_token(jwt_token)
        if payload:
            user_id = payload.get('user_id')
            user = self.user_model.get_by_id(user_id)
            if user:
                return handler(self, *args, **kwargs)
        else:
            self.response_text('ログインしなおしてください。', 400)

    return check_signin


class BaseHandler(webapp2.RequestHandler):
    @webapp2.cached_property
    def auth(self):
        return auth.get_auth()

    @webapp2.cached_property
    def user_model(self):
        return self.auth.store.user_model

    @webapp2.cached_property
    def user(self):
        user = self.user_info
        return self.user_model.get_by_id(user['user_id']) if user else None

    def get_jwt_token(self):
        jwt_token = self.request.headers.get('Authorization')
        return jwt_token.replace('Bearer ', '') if jwt_token else None

    def decode_jwt_token(self, jwt_token):
        try:
            return jwt.decode(
                jwt_token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except:
            return None

    def options(self, topic_id=None):
        pass

    def response_text(self, message='', status=200):
        self.response.content_type = 'text/plain'
        self.response.write(message)
        self.response.set_status(status)

    def response_json(self, json_data):
        self.response.content_type = 'application/json'
        self.response.write(json_data)

    def dispatch(self):
        try:
            webapp2.RequestHandler.dispatch(self)
        finally:
            self.response.headers[
                'Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE'

            self.response.headers['Access-Control-Allow-Credentials'] = 'true'
            self.response.headers['Access-Control-Allow-Origin'] = CLIENT
            self.response.headers['Access-Control-Allow-Headers'] = 'Origin, \
X-Requested-With, Content-Type, Accept, Authorization'
