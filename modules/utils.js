/**
 * Vizra Utils Library
 * @author Ruth John
 * @copyright 2019 Ruth John
 */

import Vector from './Vector.js';

// this is basically just numbers, not really utils
const utils = {
	/**
	* Returns radian value from passed in degrees
	* @param {Number} deg
	* @returns {Number}
	* @example
	* degToRad(90) // returns 1.57
	*/
	degToRad: function(deg) {
		return deg*(Math.PI/180);
	},

	// TODO change all random numbers to random ints
	randomNumber: function(min, max) {
		min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	randomInt: function(min, max) {
		min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	// do I need a random float, OR do I need to return a whole bunch of math.rand
	normalDistrib: function(amountOfNumbers) {
		let returnAr = [];
		for (let i=0; i<amountOfNumbers; i++) {
			returnAr.push(Math.random());
		}
	},
	// return a whole bunch of random whole numbers
	// normalDistribInt: function(amountOfNumbers, min, max) {
	// 	let returnAr = [];
	// 	for (let i=0; i<amountOfNumbers, i++) {
	// 		returnAr.push(this.randomInt(min, max));
	// 	}
	// },

	// monte carlo
	monteCarlo: function() {
		while(true) {
			const randOne = Math.random();
			const randTwo = Math.random();
			if (randTwo < randOne) {
				return randOne;
			}
		}
	},

	// use map to map it


	// TODO make this a map function -> map(val, startRange, endRange)
	// input val between 0-255 & return val 0-1
	mapData(val, firstRange, lastRange) {
		return Number((lastRange/firstRange)*val).toFixed(2);
	},

	normaliseData: function(dataVal) {
		return dataVal/255;
	},
	returnFPS: function(frame, fps = 24) {
		return true;
	},
	
	// vector utils -> for when you want to return a new vector and not effect the original
	// utility for two given vectors
	multiplyVectors(vector1, vector2) {
		const y = vector1.y * vector2.y;
		const x = vector1.x * vector2.x;
		return new Vector(x, y);
	},
	
	// utlity for two given vectors
	divideVectors(vector1, vector2) {
		const y = vector1.y / vector2.y;
		const x = vector1.x / vector2.x;
		return new Vector(x, y);
	},

	// takes both vectors, returns dot product
	dotProduct(vector1, vector2) {
		return (vector1.x * vector2.x) + (vector1.y * vector2.y);
	},

	// return a normalised vector - ie one unit
	normalisedVector(vector) {
		let m = vector.mag();

		if (m != 0) {
			return new Vector(vector.x*m, vector.y*m);
		} else {
			return new Vector(0,0);
		}
	},

	returnRandomVector(minX, maxX, minY, maxY) {
		minX = Math.ceil(minX);
    maxX = Math.floor(maxX);
		minY = Math.ceil(minY);
    maxY = Math.floor(maxY);
    const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
		return new Vector(x,y);
	}
	
}

export default utils;