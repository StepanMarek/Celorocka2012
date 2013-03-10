function Hexagon(position,a,options){
	GUIObject.call(this);
	
	this.actions.onClick = options.onClick === undefined ? [] : options.onClick;
	
	this.position = position;
	this.a = a;
	this.v = Math.sqrt(3)*a/2;
	
	this.boundingRadius = Math.sqrt(3*Math.sqrt(3)/(2*Math.PI))*a;
	this.boundingColor = options.boundingColor === undefined ? "#ff0000" : options.boundingColor;
	this.boundingCircle = new Circle(new Vector2(0,0),this.boundingRadius,{color:this.boundingColor});
	this.boundingCircle.renderable = options.boundingRenderable === undefined ? false : options.boundingRenderable;
	
	//Zde se vyhodnotí vlastnosti dle typu
	this.type = options.type === undefined ? "plains" : options.type;
	this.switchType(this.type);
	this.riveredSides = 0; //To znamená žádná
	
	
	
	this.render = function (ctx){
		
		var x = this.position.x;
		var y = this.position.y;
		ctx.save();
		ctx.translate(x,y);
		if(this.boundingCircle.renderable){
			this.boundingCircle.render(ctx);
		}
		ctx.restore();
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.moveTo(x-this.a,y);
		ctx.lineTo((x-this.a/2),y-this.v);
		ctx.lineTo((x+this.a/2),y-this.v);
		ctx.lineTo((x+this.a),y);
		ctx.lineTo((x+this.a/2),y+this.v);
		ctx.lineTo((x-this.a/2),y+this.v);
		ctx.lineTo((x-this.a),y);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
		if(this.riveredSides !== 0){
			this.riverRender(ctx);
		}
		
	};
};
Hexagon.prototype = new GUIObject();
Hexagon.prototype.switchType = function (type){
	switch (type){
		case "plains":
			this.color="#FFFAB3";
			break;
		case "swamps":
			this.color="#575323";
			break;
		case "forest":
			this.color="#398A19";
			break;
		case "dark":
			this.color="#000000";
			break;
		default :
			console.log("No such type");
	}
};

function Circle(position,r,options){
	GUIObject.call(this);
	
	this.color = options.color;
	this.position = position;
	this.r = r;
	
	this.render = function (ctx){
		var x = this.position.x;
		var y = this.position.y;
		
		ctx.beginPath();
		ctx.arc(x,y,this.r,0,Math.PI*2);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	};
};
Circle.prototype = new GUIObject();

function HexagonField(positionOfFirst,inRow,rows,a,hexOnClick,oddIsFirst){
	GUIObject.call(this);
	
	this.position = positionOfFirst;
	
	if(oddIsFirst){//Podmínka určující, zda budou ve předu liché či sudé řady
		var delimiter = -1;
	}
	else{
		var delimiter = 1;
	}
	
	var v = Math.sqrt(3)*a/2;
	var poleTypu = ["plains","forest","swamps"];
	
	this.rows = [];
	for(var i = 0; i < rows;i++){
		var row = [];
		if(i%2 === 1){//Podmínka zajišťující posun řad
			var prefix = delimiter*v;
		}
		else{
			var prefix = 0;
		}
		for(var j = 0;j < inRow;j++){
			this.add(new Hexagon(
				new Vector2(i*3/2*a,j*2*v+prefix),
				a,
				{onClick:hexOnClick,type:poleTypu[Math.round(Math.random()*3)]}
			));
		};
		this.rows.push(row);
	};
};
HexagonField.prototype = new GUIObject();