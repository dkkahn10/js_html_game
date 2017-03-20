let b2Vec2 = Box2D.Common.Math.b2Vec2;
let b2BodyDef = Box2D.Dynamics.b2BodyDef;
let b2Body = Box2D.Dynamics.b2Body;
let b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
let b2Fixture = Box2D.Dynamics.b2Fixture;
let b2World = Box2D.Dynamics.b2World;
let b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
let b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
let b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
let b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

let world;
let scale = 30;

function init() {
  let gravity = new b2Vec2(0, 9.8);
  let allowSleep = true; //allows objects at rest to "fall asleep" and be excluded from calculations
  world = new b2World(gravity, allowSleep);
}

function createFloor() {
  let bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.x = 640/2/scale;
  bodyDef.position.y = 450/scale;

  
}