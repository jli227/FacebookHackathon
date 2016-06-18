(function() {
    "use strict";

    var startTiming = null;
    var endTiming = null;
    var pressing = null;
    var morseSignals = [];
    var running = null;
    var trainingWord = null;

    var morseDictionary = {
        A: ["dot", "elementSpace", "dash", "charSpace"],
        B: ["dash", "elementSpace", "dot", "elementSpace", "dot", "elementSpace", "dot", "charSpace"],
        C: ["dash", "elementSpace", "dot", "elementSpace", "dash", "elementSpace", "dot", "charSpace"],
        D: ["dash", "elementSpace", "dot", "elementSpace", "dot", "charSpace"],
        E: ["dot" , "charSpace"],
        F: ["dot", "elementSpace", "dot", "elementSpace", "dash", "elementSpace", "dot", "charSpace"],
        G: ["dash", "elementSpace", "dash", "elementSpace", "dot", "charSpace"],
        H: ["dot", "elementSpace", "dot", "elementSpace", "dot", "elementSpace", "dot", "charSpace"],
        I: ["dot", "elementSpace", "dot", "charSpace"],
        J: ["dot", "elementSpace", "dash", "elementSpace", "dash", "elementSpace", "dash", "charSpace"],
        K: ["dash", "elementSpace", "dot", "elementSpace", "dash", "charSpace"],
        L: ["dot", "elementSpace", "dash", "elementSpace", "dot", "elementSpace", "dot", "charSpace"],
        M: ["dash", "elementSpace", "dash", "charSpace"],
        N: ["dash", "elementSpace", "dot", "charSpace"],
        O: ["dash", "elementSpace", "dash", "elementSpace", "dash", "charSpace"],
        P: ["dot", "elementSpace", "dash", "elementSpace", "dash", "elementSpace", "dot", "charSpace"],
        Q: ["dash", "elementSpace", "dash", "elementSpace", "dot", "elementSpace", "dash", "charSpace"],
        R: ["dot", "elementSpace", "dash", "elementSpace", "dot", "charSpace"],
        S: ["dot", "elementSpace", "dot", "elementSpace", "dot", "charSpace"],
        T: ["dash" , "charSpace"],
        U: ["dot", "elementSpace", "dot", "elementSpace", "dash", "charSpace"],
        V: ["dot", "elementSpace", "dot", "elementSpace", "dot", "elementSpace", "dash", "charSpace"],
        W: ["dot", "elementSpace", "dash", "elementSpace", "dash", "charSpace"],
        X: ["dash", "elementSpace", "dot", "elementSpace", "dot", "elementSpace", "dash", "charSpace"],
        Y: ["dash", "elementSpace", "dot", "elementSpace", "dash", "elementSpace", "dash", "charSpace"],
        Z: ["dash", "elementSpace", "dash", "elementSpace", "dot", "elementSpace", "dot", "charSpace"]
    };

    window.onload = function() {
        document.getElementById("train").onclick = train;
        document.getElementById("test").onclick = test;
        document.getElementById("confirmWord").onclick = confirmWord;
        document.getElementById("morseButton").addEventListener("mousedown", mouseDown);
        document.getElementById("morseButton").addEventListener("mouseup", mouseUp);
    };

    var confirmWord = function() {
        trainingWord = document.getElementById("trainingWord").value;

        if (trainingWord.length < 5) {
            alert("Enter a longer word");
        } else {
            trainingWord = trainingWord.toUpperCase();

            document.getElementById("trainingWord").disabled = true;
            document.getElementById("trainingWord").style.borderColor = "#6FD656";
            document.getElementById("trainingWord").style.borderWidth = "2px 2px 2px 2px";

            document.getElementById("morseInput").style.display = "inline-block";
        }
    };

    var mouseDown = function() {
        if (!pressing) {
            pressing = true;
            startTiming = new Date();
            if (endTiming) {
                var elapsed = Math.abs(startTiming - endTiming);
                console.log("element space/character space:" + elapsed);
                var morseNode = {elapsedTime: elapsed, state: "off", category: false};

                var li = document.createElement("LI");
                var textNode = document.createTextNode("Up for: " + elapsed + " ms");
                li.appendChild(textNode);
                document.getElementById("log").appendChild(li);

                var div = document.getElementById("timing");
                div.scrollTop = div.scrollHeight;

                morseSignals.push(morseNode);
                endTiming = null;
            }
        }
    };

    var mouseUp = function() {

        pressing = null;
        endTiming = new Date();
        var elapsed = Math.abs(endTiming-startTiming);
        console.log("dot/dash:" + elapsed);
        var morseNode = {elapsedTime: elapsed, state: "on", category: false};

        var li = document.createElement("LI");
        var textNode = document.createTextNode("Down for: " + elapsed + " ms");
        li.appendChild(textNode);
        document.getElementById("log").appendChild(li);

        var div = document.getElementById("timing");
        div.scrollTop = div.scrollHeight;

        morseSignals.push(morseNode);
        startTiming = null;
    };

    var test = function() {
        endTiming = null;

        running.test();

        morseSignals = [];
    };


    var train = function() {

        var trainingMorseCode = [];

        endTiming = null;

        for (var i = 0; i < trainingWord.length; i++) {

            var character = trainingWord.charAt(i);

            console.log(character);

            console.log(morseDictionary[character]);

            trainingMorseCode = trainingMorseCode.concat(morseDictionary[character]);
        }

        trainingMorseCode.pop(); //remove extra charSpace

        console.log("training morse code length : " + trainingMorseCode.length);

        console.log("training set: " + morseSignals.length);
        if (morseSignals.length == 0) {
            alert("Press the button to enter morse signals");

        } else {

            if (morseSignals.length > 1) {
                if (morseSignals.length < trainingMorseCode.length) {

                    alert("The morse code you entered was shorter than the expected length given the word you typed");

                } else if (morseSignals.length > trainingMorseCode.length) {

                    alert("The morse code you entered was longer tha the expected legnth given the word you typed");
                } else {
                    for (var i in morseSignals) {

                        morseSignals[i].category = trainingMorseCode[i];
                    }
                    running = new run("train");

                    alert("Training Successful");
                    console.log(morseSignals);
                    document.getElementById("train").disabled = true;
                    document.getElementById("test").disabled = false;
                    document.getElementById("letterDiv").style.display = "inline-block";

                }

            } else {

                alert("Your training word must have multiple morse signals. I recommend the word: hello" );
            }

        }

        morseSignals = [];

    };


    // Node
    var Node = function(signal) {
        for (var property in signal) {
            if (signal.hasOwnProperty(property)) {
                this[property] = signal[property];
            }
        }

    };

    // Node list
    var NodeList = function(k) {
        this.nodes = [];
        this.k = k;
    };

    /*replace var with this?*/
    NodeList.prototype.draw = function() {
        this.range();
        var elapsedRange = this.timeRange.max - this.timeRange.min;

        var width = 1000;
        var height = 100;

        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0,0,width, height);

        for (var i in this.nodes) {

            var normalX = (this.nodes[i].elapsedTime - this.timeRange.min)/elapsedRange;

            var xPos = normalX * width;
            var yPos = 95;

            switch (this.nodes[i].category)
            {
                case 'elementSpace':
                    ctx.fillStyle = 'red';
                    break;
                case 'charSpace':
                    ctx.fillStyle = 'green';
                    break;
                case 'dot':
                    ctx.fillStyle = 'blue';
                    break;

                case 'dash':
                    ctx.fillStyle = 'pink';
                    break;

                default:
                    ctx.fillStyle = 'black';
            }

            switch (this.nodes[i].state)
            {
                case 'on':
                    yPos = 5;
                    break;

                default:
                    yPos = 95;

            }

            if (!this.nodes[i].category) {
                if (this.nodes[i].state == 'on') {
                    yPos = 25;

                } else {
                    yPos = 75;
                }
            }
            ctx.beginPath();
            ctx.arc(xPos, yPos, 5, 0, 2 * Math.PI);
            if (this.nodes[i].category || this.nodes[i].state == 'on') {

                ctx.fill();
            } else {

                ctx.stroke();
            }
            ctx.closePath();
        }

    };

    /*
    Post: getUnknown identifies morse nodes that
    are not classified to a category.
    */
    NodeList.prototype.getUnknown = function() {
        this.unknownNode = [];

        for(var i in this.nodes) {
            if (this.nodes.hasOwnProperty(i) && !this.nodes[i].category) {
                this.unknownNode.push(this.nodes[i]);
            }
        }
        for (var j in this.unknownNode) {
            console.log("unknown node-> " + "Elapsed Time: " + this.unknownNode[j].elapsedTime +
            ", Category: " + this.unknownNode[j].category + ", State: " + this.unknownNode[j].state);
        }
    };

    /*
    Post:
    Calls getUnknown to obtain unclassified nodes.
    Calls determineClosest on each unclassified node
    to obtain list of closest nodes, regardless of 'state' value.
    Then, determines which nodes are most similar based on elapsedTime difference AND state.
    */
    NodeList.prototype.classify = function() {
        this.getUnknown();

        this.numUnlabeled = this.unknownNode.length;
        console.log("numbered of unlabeled: " + this.numUnlabeled);

        if (this.numUnlabeled > 0) {
            for(var i in this.unknownNode) {
                this.currentUnknown = this.unknownNode[i];

                this.determineClosest(this.currentUnknown); //this.closest is created

                this.searchIndex = this.k;
                this.possibleNodes = [];

                // compare closest neighbors, regardless of state
                for(var j = 0; j < this.searchIndex; j++) {
                    // specify state
                    if(this.currentUnknown.state == this.closest[j].node.state) {
                        this.possibleNodes.push(this.closest[j].node);
                    } else {
                        this.searchIndex++;
                    }
                }
                this.labelCategory();
                console.log("after: " + JSON.stringify(this.nodes, null, 4));

            }
        }

        this.constructWord();
    };

    NodeList.prototype.constructWord = function() {

        this.signalArray = [];

        this.nowKnownSignals = this.nodes.slice((this.numUnlabeled*-1));

        for (var i in this.nowKnownSignals) {
            this.signalArray = this.signalArray.concat(this.nowKnownSignals[i].category);
        }

        this.signalArray.push("charSpace");

        for (var j in morseDictionary) {

            if (morseDictionary[j].length == this.signalArray.length) {
                this.match = true;
                for (var k in morseDictionary[j]) {
                    if (this.signalArray[k] != morseDictionary[j][k]) {
                        this.match = false;
                    }
                }

                if (this.match) {
                    document.getElementById("letter").innerHTML += j;
                }
            }
        }
    };

    NodeList.prototype.labelCategory = function() {
        var findMajority = {};
        for (var i in this.possibleNodes) {
            var keyVal = this.possibleNodes[i].category;
            console.log(keyVal);

            if(findMajority.hasOwnProperty(keyVal)) {
                findMajority[keyVal] = findMajority[keyVal] + 1;
            } else {
                findMajority[keyVal] = 1;
            }
        }

        for (var j in findMajority) {
            if (findMajority[j] >= 2) {
                this.currentUnknown.category = j;
            }
        }
    };

    NodeList.prototype.determineClosest = function(unknown) {
        console.log("unknown node-> " + "Elapsed Time: " + unknown.elapsedTime +
            ", Category: " + unknown.category + ", State: " + unknown.state);
        this.queryElapsedTime = unknown.elapsedTime;
        this.closest = [];

        for (var j in this.nodes) {
            if(this.nodes[j].category) { /*category is defined*/
                this.difference = Math.abs(this.nodes[j].elapsedTime - this.queryElapsedTime);
                this.closest.push({ node: this.nodes[j], difference: this.difference});
            }
        }

        this.closest.sort(function (x,y) {
            return x.difference - y.difference;
        });
    };


    NodeList.prototype.add = function(node) {
        this.nodes.push(node);
    };

    // Lists all elements within node list
    NodeList.prototype.toString = function() {
        for (var i in this.nodes) {
            console.log("elapsed time: " + this.nodes[i].elapsedTime);
            console.log("state: " + this.nodes[i].state);
            console.log("type: " + this.nodes[i].category);
            console.log();
        }
    };

    //
    NodeList.prototype.range = function() {
        this.timeRange = {min: null, max: null};

        if(this.nodes[0].elapsedTime > this.nodes[1].elapsedTime) {
            this.timeRange.min = this.nodes[1].elapsedTime;
            this.timeRange.max = this.nodes[0].elapsedTime;

        } else {
            this.timeRange.min = this.nodes[0].elapsedTime;
            this.timeRange.max = this.nodes[1].elapsedTime;
        }

        for (var i = 2; i < this.nodes.length; i++) {
            if(this.nodes[i].elapsedTime > this.timeRange.max) {
                this.timeRange.max = this.nodes[i].elapsedTime;
            }
            if (this.nodes[i].elapsedTime < this.timeRange.min) {
                this.timeRange.min = this.nodes[i].elapsedTime;
            }
        }

        console.log("min: " + this.timeRange.min);
        console.log("max:" + this.timeRange.max);
    };

    //
    var run = function(mode) {
        if (mode == "train") {
            var nodes = new NodeList(3);
        }

        for (var i in morseSignals) {
            nodes.add( new Node(morseSignals[i]) );
        }

        nodes.draw();

        this.test = function() {
            for (var j in morseSignals) {
                nodes.add(new Node(morseSignals[j]) );
            }

            nodes.draw();
            nodes.classify();
            setTimeout(function() {nodes.draw();}, 2000);
        }
    };
}());