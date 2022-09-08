#!/usr/bin/sh

mongosh -u ${MONGO_INITDB_ROOT_USERNAME} -p ${MONGO_INITDB_ROOT_PASSWORD} <<EOF
use ${MONGO_INITDB_DATABASE}

db.users.insertOne({"__v": 0,"username": "admin","name": "Administrator","password": "\$2a\$12\$rBwyV5XhtNy1cyY9CQs3A.Giae1vHoTlb8pi7u7Ti1BVGxCR4iITa","role": "Admin"})
db.users.insertOne({"__v": 0,"username": "user","name": "User 1","password": "\$2a\$12\$67JMCRSZoSuqmTPqrF94KONKM.yyXQzmsmqVtr0KTioiYDd03e6iO","role": "User"})