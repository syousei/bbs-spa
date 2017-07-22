#!/usr/bin/env python
# -*- coding: utf-8 -*-

from google.appengine.ext import ndb

from models.base import BaseModel

from models.user import User


class Message(BaseModel):
    author_key = ndb.KeyProperty(kind=User)
    body = ndb.TextProperty()
