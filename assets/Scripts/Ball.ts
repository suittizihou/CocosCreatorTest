// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import { TagType } from "./TagType";

@ccclass
export default class Ball extends cc.Component {

    @property(cc.RigidBody)
    rigid: cc.RigidBody = null;
    @property(cc.PhysicsCircleCollider)
    collider: cc.PhysicsCircleCollider = null;

    firstVelocity: cc.Vec2 = cc.v2(100, 0);

    protected start(): void {
        this.rigid.enabledContactListener = false;
        this.rigid.gravityScale = 0;
        this.rigid.linearVelocity = Object.assign({}, this.firstVelocity);
        this.collider.sensor = true;
        this.collider.apply();
        console.log("一旦外す");

        const startPos: number = this.node.getPosition().x;
        const endPos: number = this.node.getPosition().x + this.node.getContentSize().width;
        const func = function(dt){

            if(this.node.getPosition().x <= endPos) return;

            console.log("もう一回入れた");
            this.rigid.enabledContactListener = true;
            this.rigid.gravityScale = 1;
            this.collider.sensor = false;
            this.collider.apply();

            this.unschedule(func);    
        }

        this.schedule(func, 0);
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void{
        
        const curVelocity: cc.Vec2 = Object.assign({}, this.rigid.linearVelocity);

        if(otherCollider.tag === TagType.Wall){
            this.rigid.linearVelocity = cc.v2(-curVelocity.x, curVelocity.y);
        }

        if(otherCollider.tag === TagType.Plane){
            this.rigid.linearVelocity = cc.v2(curVelocity.x, -curVelocity.y);
        }
    }
}
