
"use strict";

//---------document ready-----------------------------------------------
$(document).ready(function(){

    var INITIAL_SESSION_TIME = 25;
    var INITIAL_BREAK_TIME = 5;
    var INTERVAL_LENGTH = 1000; // 1 second

//---------TIMER CLASS--------------------------------------------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------

//---------TIMER CONSTRUCTOR--------------------------------------------
    var Timer = function(initialLength,$target,$btnDisplay,$filling){

        this.totalTime = initialLength;  //Total timer period.
        this.remaining = this.totalTime*60; //Remaining timer period.
        this.$target = $target;          //The timer display div.
        this.$btnDisplay = $btnDisplay;  //Display in between - and + buttons.
        this.$filling = $filling;        //The main circle display background.
        this.startTime = null;           //Start time of the timer.
        this.timerID = null;             //The interval ID from the setInterval() call in Timer.runTimer().
                                         //  Used in pause() and stop() methods to kill the setInterval() function.
        this.active = false;             //Is the timer active?
        this.offset = 0;                 //Holds the amount of time passed after the Timer is paused with pause().
    };

//---------TIMER PROTOTYPE METHODS--------------------------------------
//----------------------------------------------------------------------

//---------runTimer()---------------------------------------------------
    Timer.prototype.runTimer = function(){

        this.active = true;
		this.$target.html(this.minutes() + ':' + this.seconds());
		
        //Note the time when the timer was started.
        this.startTime = +(new Date);

        //Used to pass 'this' to setInterval().
        var timer = this;

		var fillPct = 100*(timer.remaining / (timer.totalTime*60));
        timer.$filling.css("height",fillPct.toString() + "%");
        
        this.timerID = setInterval(function(){

				timer.remaining = Math.round((timer.totalTime*60 - ((+(new Date) - timer.startTime)/INTERVAL_LENGTH))) - timer.offset;
                if(timer.remaining < 0){
                    mode.switchMode();
                }
                
                timer.$target.html(timer.minutes() + ':' + timer.seconds());
                fillPct = 100*(timer.remaining / (timer.totalTime*60));
                timer.$filling.css("height",fillPct.toString() + "%");
            }, INTERVAL_LENGTH, timer/* "this" */);

        };

//---------pause()-----------------------------------------------------
    Timer.prototype.pause = function(){

		this.offset = this.totalTime*60 - this.remaining;
        clearInterval(this.timerID);
        this.active = false;
    }; 

//---------reset()-----------------------------------------------------
    Timer.prototype.reset = function(){
        this.remaining = this.totalTime;
        this.offset = 0;
    };

//---------seconds()---------------------------------------------------
	Timer.prototype.seconds = function(){
		if(this.remaining%60 < 10)
			return '0' + this.remaining%60;
		else
			return this.remaining%60;
	};

//---------minutes()---------------------------------------------------	
	Timer.prototype.minutes = function(){
		if(Math.floor(this.remaining/60) < 10)
			return '0' + Math.floor(this.remaining/60);
		else 
			return Math.floor(this.remaining/60);
	};
	
//---------------------End of Timer class------------------------------
//---------------------------------------------------------------------
//---------------------------------------------------------------------





    var $timerDisplay   = $("#timer-numbers"),
        $brkDisplay     = $("#timer-numbers-break"),
        $timerToggle    = $("#session-timer"),
        $brkTimerToggle = $("#break-timer"),
        $brkBtnMinus    = $("#break-minus-btn"),
        $brkBtnPlus     = $("#break-plus-btn"),
        $brkBtnDisplay  = $("#break-btn-display"),
        $mainBtnMinus   = $("#main-minus-btn"),
        $mainBtnPlus    = $("#main-plus-btn"),
        $mainBtnDisplay = $("#main-btn-display"),
        $colorFill      = $("#timer-display-circle"),
        $mainFilling    = $("#timer-display-inner-circle"),
        $breakFilling   = $("#timer-display-inner-circle-break");

    var sessionTimer = new Timer(INITIAL_SESSION_TIME,$timerDisplay,$mainBtnDisplay,$mainFilling);
    var breakTimer   = new Timer(INITIAL_BREAK_TIME,$brkDisplay,$brkBtnDisplay,$breakFilling);

    var mode = { timerMode: "session",
                 timer:     sessionTimer,
                 $target:   $("#session-timer"),

                 switchMode: function(){

                    //Stop and reset the current timer.
                    this.timer.pause();
                    this.timer.reset();
                    
                    //Hide the current timer.
                    this.$target.css('display','none');

                    //Switch it over.
                    if(this.timerMode === "session"){
                        this.timerMode = "break";
                        this.timer = breakTimer;
                        this.$target = $("#break-timer");
                    }
                    else{        	
                        this.timerMode = "session";
                        this.timer = sessionTimer;
                        this.$target = $("#session-timer");
                    }

					//Show the new timer face.
                    this.$target.show();

                    //Start the switched timer.
                    this.timer.runTimer();
                }
    };


	//-------Button clicks----------------------------------
	var timerToggle = function(){
    	
        if(mode.timer.active){
            mode.timer.$target.html(mode.timer.minutes() + ':' + mode.timer.seconds());
            mode.timer.pause();
        }
        else{
            mode.timer.runTimer();
        }
    };
    
    $timerToggle.click(function(){
    	
        timerToggle();
    });
    $brkTimerToggle.click(function(){
    	
        timerToggle();
    });
    
    $brkBtnMinus.click(function(){
    	//console.log('break minus button clicked');
    	if(breakTimer.totalTime <= 0){}
    	else if(!mode.timer.active){
    		breakTimer.reset();
	    	--breakTimer.totalTime;
    	    breakTimer.remaining = breakTimer.totalTime*60;
            breakTimer.$target.html(breakTimer.totalTime);
            breakTimer.$btnDisplay.html(breakTimer.totalTime);
        }
    });
    $brkBtnPlus.click(function(){
    	
    	if(!mode.timer.active){
    		breakTimer.reset();
	    	++breakTimer.totalTime;
    	    breakTimer.remaining = breakTimer.totalTime*60;
            breakTimer.$target.html(breakTimer.totalTime);
            breakTimer.$btnDisplay.html(breakTimer.totalTime);
        }
    });
    $mainBtnMinus.click(function(){
    	
    	if(sessionTimer.totalTime <= 0){}
    	else if(!mode.timer.active){
    		sessionTimer.reset();
	    	--sessionTimer.totalTime;
    	    sessionTimer.remaining = sessionTimer.totalTime*60;
            sessionTimer.$target.html(sessionTimer.totalTime);
            sessionTimer.$btnDisplay.html(sessionTimer.totalTime);
        }
    });
    $mainBtnPlus.click(function(){
    	
    	if(!mode.timer.active){
    		sessionTimer.reset();
	    	++sessionTimer.totalTime;
    	    sessionTimer.remaining = sessionTimer.totalTime*60;
            sessionTimer.$target.html(sessionTimer.totalTime);
            sessionTimer.$btnDisplay.html(sessionTimer.totalTime);
        }
    });
});//----End of document ready-------------
