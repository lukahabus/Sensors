#!/bin/bash

PROTO_DEST=./src/proto

mkdir -p ${PROTO_DEST}

# JavaScript code generation
yarn run grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:${PROTO_DEST} \
    --grpc_out=${PROTO_DEST} \
    -I ./proto \
    proto/*.proto

sed -i "s/require('grpc')/require('@grpc\/grpc-js')/g" ${PROTO_DEST}/*