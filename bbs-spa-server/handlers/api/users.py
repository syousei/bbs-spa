#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import logging
import os

from google.appengine.api import mail

from handlers.base import BaseHandler

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = os.environ['JWT_ALGORITHM']


class RequestHandler(BaseHandler):
    def user_to_dict(self, user):
        return {
            'id': user.key.id(),
            'name': user.name,
            'imageUrl': user.image_url,
        }

    def post(self):
        form_values = json.loads(self.request.body)

        # バリデーション
        form_errors = False
        if (form_values['name'] == "" or form_values['email'] == ""
                or form_values['password'] == ""):
            form_errors = 1
        if form_errors:
            self.response_text('入力内容を確認してください。', 400)

        else:
            unique_properties = []
            user_data = self.user_model.create_user(
                form_values['email'],
                unique_properties,
                email=form_values['email'],
                name=form_values['name'],
                password_raw=form_values['password'],
                verified=False, )

            if not user_data[0]:  # user_data is a tuple (boolean, info)
                # 409 Conflict
                self.response_text('このメールアドレスは登録済みです。', 409)
            else:
                user = user_data[1]
                user_id = user.get_id()

                token = self.user_model.create_signup_token(user_id)
                verification_url = self.uri_for(
                    'verificate',
                    type='v',
                    user_id=user_id,
                    signup_token=token,
                    _full=True)

                logging.info(verification_url)

                mail.send_mail(
                    sender=os.environ['EMAIL_SENDER'],
                    to=form_values['email'],
                    subject='ユーザー登録を受け付けました',
                    body='''※このメールはSAMPLEより自動的にお送りしたものです。
※送信専用のメールアドレスですので、返信はお受けできません。

%s 様

ユーザー登録を受け付けました。
次のURLをクリックするとユーザー登録が完了します。

%s

※このメールに心当たりがない場合は、お手数ですが破棄してください。
''' % (form_values['name'].encode('utf-8'), verification_url))

                # 200 OK
                self.response_json('{"message":"本人確認のためにメールを送信しました。"}')
