var game = new Phaser.Game(600,480,Phaser.AUTO);
var GameState = {
    preload:function () {
    this.load.image('background','assets/images/background.png');
    this.load.spritesheet('chicken','assets/images/chicken_spritesheet.png',131,200,3);
    this.load.spritesheet('horse','assets/images/horse_spritesheet.png',212,200,3);
    this.load.spritesheet('pig','assets/images/pig_spritesheet.png',297,200,3);
    this.load.spritesheet('sheep','assets/images/sheep_spritesheet.png',244,200,3);
    this.load.image('arrow','assets/images/arrow.png');

    this.load.audio('chickenaudio',['assets/audio/chicken.mp3','assets/audio/chicken.ogg']);
        this.load.audio('horseaudio',['assets/audio/horse.mp3','assets/audio/horse.ogg']);
        this.load.audio('pigaudio',['assets/audio/pig.mp3','assets/audio/pig.ogg']);
        this.load.audio('sheepaudio',['assets/audio/sheep.mp3','assets/audio/sheep.ogg']);
    },
    create:function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally=true;
        this.scale.pageAlignVertically=true;
        this.background = this.game.add.sprite(0,0,'background');

        // this.chicken = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'chicken');
        // this.chicken.anchor.setTo(0.5,0.6);
        // this.chicken.scale.setTo(1,1);
        // this.chicken.inputEnabled=true;
        // this.chicken.input.pixelPerfectClick=true;
        // this.chicken.events.onInputDown.add(this.animateAnimal,this);
        var animalData=[{key:'chicken',text:'CHICKEN',audio:'chickenaudio'},
            {key:'horse',text:'HORSE',audio:'horseaudio'},
            {key:'pig',text:'PIG',audio:'pigaudio'},
            {key:'sheep',text:'SHEEP',audio:'sheepaudio'}
        ];
        this.animals = this.game.add.group();
        var animal;var self=this;
        animalData.forEach(function (element) {
            animal=self.animals.create(1000,self.game.world.centerY,element.key,0);
            animal.anchor.setTo(0.5);
            animal.scale.setTo(0.5);
            animal.customParams={text:element.text,sound:self.game.add.audio(element.audio)};
            animal.animations.add('animate',[0,1,2,1,0,1],3,false);
            animal.inputEnabled = true;
            animal.input.pixelPerfectClick=true;
            animal.events.onInputDown.add(self.animateAnimal,self);

        });
        this.currentAnimal = this.animals.next();
        this.currentAnimal.position.set(this.game.world.centerX,this.game.world.centerY);
        this.showText(this.currentAnimal);


        this.rightarrow = this.game.add.sprite(560,this.game.world.centerY,'arrow');
        this.rightarrow.anchor.setTo(0.5);
        this.rightarrow.scale.setTo(0.6);
        this.rightarrow.customParams = {direction:1};
        this.rightarrow.inputEnabled=true;
        this.rightarrow.input.pixelPerfectClick=true;
        this.rightarrow.events.onInputDown.add(this.switchAnimal,this);

        this.leftarrow = this.game.add.sprite(40,this.game.world.centerY,'arrow');
        this.leftarrow.anchor.setTo(0.5);
        this.leftarrow.scale.setTo(-0.6);
        this.leftarrow.customParams = {direction:-1};
        this.leftarrow.inputEnabled=true;
        this.leftarrow.input.pixelPerfectClick=true;
        this.leftarrow.events.onInputDown.add(this.switchAnimal,this);

    },
    update:function () {
    },
    switchAnimal:function (sprite, event) {
        if(this.isMoving){return false}
        this.isMoving = true;

        this.animalText.visible = false;

        var newAnimal,endX;
        if(sprite.customParams.direction>0) {
            newAnimal = this.animals.next();
            newAnimal.x  = -newAnimal.width/2;
            endX = 600 + this.currentAnimal.width / 2;
        }else {
            newAnimal = this.animals.previous();
            newAnimal.x = 600+newAnimal.width/2;
            endX = -this.currentAnimal.width/2;
        }

        var newAnimalMovement  = this.game.add.tween(newAnimal);
        newAnimalMovement.to({x:this.game.world.centerX},1000);
        newAnimalMovement.onComplete.add(function () {
            this.isMoving=false;
            this.showText(newAnimal);
        },this);
        newAnimalMovement.start();

        var currentAnimalMovement =  this.game.add.tween(this.currentAnimal);
        currentAnimalMovement.to({x:endX},1000);
        currentAnimalMovement.start();
        this.currentAnimal=newAnimal;
    },
    animateAnimal:function (sprite, event) {
        sprite.play('animate');
        sprite.customParams.sound.play();
    },
    showText:function (animal) {
        var style = {
            font:'bold 20pt Arial', fill:'#aaa',align:'center'
        }
        if(!this.animalText){
            this.animalText = this.game.add.text(this.game.width/2,this.game.height*0.85,' ',style);
             this.animalText.anchor.setTo(0.5);
        }
        this.animalText.setText(animal.customParams.text);
        this.animalText.visible=true;
    }
    
};
game.state.add('GameState',GameState);
game.state.start('GameState');