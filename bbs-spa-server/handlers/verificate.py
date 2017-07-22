#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from handlers.base import BaseHandler

CLIENT = os.environ['CLIENT']


class RequestHandler(BaseHandler):
    def get(self):
        user = None
        user_id = self.request.get('user_id')
        signup_token = self.request.get('signup_token')
        verification_type = self.request.get('type')

        user, timestamp = self.user_model.get_by_auth_token(
            int(user_id), signup_token, 'signup')

        if not user:
            self.abort(404)

        if verification_type == 'v':
            self.user_model.delete_signup_token(user.get_id(), signup_token)

        if not user.verified:
            user.verified = True
            user.put()
            self.redirect('%s/users/signup/verified' % CLIENT)

        elif verification_type == 'p':
            self.redirect('%s/users/resetpassword' % CLIENT)
        else:
            self.abort(404)
