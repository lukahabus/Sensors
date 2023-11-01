// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var sensor_pb = require('./sensor_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sensor_Measurement(arg) {
  if (!(arg instanceof sensor_pb.Measurement)) {
    throw new Error('Expected argument of type sensor.Measurement');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sensor_Measurement(buffer_arg) {
  return sensor_pb.Measurement.deserializeBinary(new Uint8Array(buffer_arg));
}


var SensorService = exports.SensorService = {
  getMeasurement: {
    path: '/sensor.Sensor/GetMeasurement',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: sensor_pb.Measurement,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_sensor_Measurement,
    responseDeserialize: deserialize_sensor_Measurement,
  },
};

exports.SensorClient = grpc.makeGenericClientConstructor(SensorService);
