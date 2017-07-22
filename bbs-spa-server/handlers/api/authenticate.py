#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import os

import jwt
from handlers.base import BaseHandler
from models.user import User
from webapp2_extras.auth import InvalidAuthIdError, InvalidPasswordError

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = os.environ['JWT_ALGORITHM']


class RequestHandler(BaseHandler):
    def post(self):
        json_data = self.request.body
        form_values = json.loads(json_data)
        email = form_values['email']
        password = form_values['password']

        try:
            u = self.auth.get_user_by_password(
                auth_id=email,
                password=password,
                remember=False,
                save_session=False,
                silent=False, )

            user = User.get_by_id(u['user_id'])

            if not user.verified:
                self.response_text('このメールアドレスは本人確認中です。', 400)
            else:
                payload = {
                    'iss': self.request.host,
                    'user_id': user.key.integer_id(),
                }
                jwt_token = jwt.encode(payload, JWT_SECRET, JWT_ALGORITHM)
                json_data = json.dumps({
                    'id': user.key.integer_id(),
                    'name': user.name,
                    'imageUrl': user.image_url,
                    'token': jwt_token
                })
                self.response_json(json_data)

        except InvalidAuthIdError:
            self.response_text('登録されていないメールアドレスです。', 400)

        except InvalidPasswordError:
            self.response_text('パスワードが間違っています。', 400)
