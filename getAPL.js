var getAPL = getAPL || (function() {
    'use strict';
    var version = 1.0,

    checkInstall = function() {
        log('getAPL v'+version+' is ready!  Designed for 5e AL APL Calculation');
    },
	
    isLevel = function(id) {
        var isLevel = findObjs({_type: 'attribute', _characterid: id, name: 'level'});
        if (_.isUndefined(isLevel[0])) {
            return false;
        } else {
            return isLevel[0].get('current');
        }
    },

	getSelectedCharacters = function(selected) {
        return _.chain(selected)
            .map(function(s){
                return getObj(s._type,s._id);
            })
            .reject(_.isUndefined)
            .map(function(c){
                return getObj('character', c.get('represents'));
            })
            .filter(_.identity)
            .value();        
    },
	
	round = function(value, decimals) {
		return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
	},
	
	partyStr = function(partySize, targetAPL, currAPL) {
		if ((partySize > 2 && partySize < 5) && currAPL < targetAPL) {
			return "Very weak"
		} else if ((partySize >= 3 && partySize <= 4) && currAPL == targetAPL) {
			return "Weak"
		} else if ((partySize >= 3 && partySize <= 4) && currAPL > targetAPL) {
			return "Average"
		} else if (partySize == 5 && currAPL < targetAPL) {
			return "Weak"
		} else if (partySize == 5 && currAPL == targetAPL) {
			return "Average"
		} else if (partySize == 5 && currAPL > targetAPL) {
			return "Strong"
		} else if ((partySize >= 6 && partySize <= 7) && currAPL < targetAPL) {
			return "Average"
		} else if ((partySize >= 6 && partySize <= 7) && currAPL == targetAPL) {
			return "Strong"
		} else if ((partySize >= 6 && partySize <= 7) && currAPL > targetAPL) {
			return "Very Strong"
		}
	},
	
	handleInput = function(msg) {
		var args;
		var char;
		if (msg.type !== "api") {
			return;
		}
		args = msg.content.split(/\s+/);
		if(args[0].toLowerCase() == "!getapl") {
				char = _.uniq(getSelectedCharacters(msg.selected));
				var selTot = "0"
				_.each(char, function(a) {
					if (isLevel(a.id) !== "0") {
						selTot = Number(selTot) + Number(isLevel(a.id))
					}
				});
				if (msg.selected.length < 3 || msg.selected.length > 7) {
					sendChat ("getAPL", "/w "+msg.who+" **Not AL Legal** (less than 3 or more than 7) - please check your token selection and try again.")	
				} else if ((args[1] == '1') || (args[1] == '2') || (args[1] == '3') || (args[1] == '4') || (args[1] == '5') || (args[1] == '6') || (args[1] == '7') || (args[1] == '8') || (args[1] == '9') || (args[1] == '10') || (args[1] == '11') || (args[1] == '12') || (args[1] == '13') || (args[1] == '14') || (args[1] == '15') || (args[1] == '16') || (args[1] == '17') || (args[1] == '18') || (args[1] == '19') || (args[1] == '20')) {
					sendChat ("getAPL", "/w "+msg.who+" **"+msg.selected.length+"** Players at APL: **"+round(selTot/msg.selected.length,0)+"** (**"+partyStr(msg.selected.length,args[1],round(selTot/msg.selected.length,0))+"**) - Target APL: **"+args[1]+"**.")
				} else {
					sendChat ("getAPL", "/w "+msg.who+" **"+msg.selected.length+"** Players at APL: **"+round(selTot/msg.selected.length,0)+"**.<br /><em>Try adding your target APL to the end for more information such as:</em><br />**!getAPL 3**")
				}
		}
    },

    registerEventHandlers = function() {
        on('chat:message', handleInput);
    };

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers
    };
}());


on('ready',function(){
	'use strict';
	
    getAPL.CheckInstall();
    getAPL.RegisterEventHandlers();
});