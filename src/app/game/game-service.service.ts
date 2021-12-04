import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { Blub } from "../models/blub";
import { User } from "../models/user";

const colorArray = ["yellow", "blue", "green", "red", "black", "lightblue"];
@Injectable({ providedIn: "root" })
export class GameService {
    private blubs: Blub[] = [];
    private user: User = { username: '', scores: [], currentScore: 0, bestScore: 0 };
    private userUpdated = new Subject<{userData:User}>();

    constructor() { }

    intializeBlubArray():void {
        colorArray.forEach((item, index) => {
            let singleBlub: Blub = {step: index + 1, color: item }
            this.blubs.push(singleBlub);
        })
        this.shuffleBlubArray();
    } 
    //Shuffle the game array after intialize
    private shuffleBlubArray():void{
        for (let i = this.blubs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.blubs[i], this.blubs[j]] = [this.blubs[j], this.blubs[i]];
        }
    }
    updateUserName(username:string):void {
        this.user.username = username;
        this.userUpdated.next({userData:this.user});  
    }
    initScore():void {
        this.user.currentScore = 0;
    }
    updateCurrentScore():void {
        this.user.currentScore += 10;
    }
    addScoreToList():void {
        this.user.scores.push(this.user.currentScore);
        this.user.scores.sort().reverse(); 
        this.updateBestScore();  
    }
    updateBestScore() {
        this.user.bestScore = Math.max(...this.user.scores);
    }
    getUser():User {
        return this.user;
    }
    getUserUpdateLiscener() {
        return this.userUpdated.asObservable();
    }
    getBlubArray():Blub[] {
        return this.blubs;
    }
}



