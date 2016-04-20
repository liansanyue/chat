(function() {

    var Init = {
        socket: io.connect(), //与服务器进行连接
        sendBtn: document.getElementById('sendBtn'), //发送消息按钮
        textarea: document.getElementById('content'), //消息编辑区
        div: document.getElementById('ename'), //遮罩层
        input: document.getElementById('ename').getElementsByTagName('input')[0], //遮罩层确定按钮
        view: document.getElementById("view"), //消息显示区
        userCount: document.getElementById('usercount'), //在线人数和人员列表
        name:"",
        //遮罩层初始化
        maskInit: function() {
            this.div.style.width = document.body.offsetWidth + "px";
            this.div.style.height = document.body.offsetHeight + "px";
            this.div.style.display = "block";
            this.input.focus();

        },
        ////////////////////////////////////////////////////////
        //事件行为初始化
        eventInit: function() {
            //遮罩层点击事件
            var that = this;
            var botton = that.div.getElementsByTagName('button')[0];

            botton.onclick = function() {
                if (that.input.value.trim() != "") {
                    that.name = that.input.value.trim();
                    that.socket.emit('login', that.name);
                } else {
                    alert("请输入名字！");
                }
            };
            /////////////////////////////////////////
            //遮罩层键盘事件
            that.input.onkeydown = function(e) {
                e = e || event;
                if (e.keyCode === 13) {
                    if (that.input.value.trim() != "") {

                        that.name = that.input.value.trim();
                        that.socket.emit('login', that.name);
                    } else {
                        alert("请输入名字！");
                    }
                }
            };
            ///////////////////////////////////////////
            //消息编辑区键盘事件
            that.textarea.onkeydown = function(e) {
                e = e || event;
                if (e.keyCode === 13) {
                    e.preventDefault(); //取消默认行为：回车          
                    var str = that.textarea.value;
                    that.socket.emit('postMsg', str);//触发新消息
                    that.textarea.value = "";
                    that.textarea.focus();
                }
            };
            /////////////////////////////////////////////
            //发送按钮点击事件
            that.sendBtn.onclick = function() {
                if (that.name == "") {
                    that.maskInit();
                } else {
                    var str = that.textarea.value
                    that.socket.emit('postMsg', str);
                    that.textarea.value = "";
                    that.textarea.focus();
                }
                ///////////////////////////////////////////////
            }
        },
        //socket监听
        socketInit: function() {
            var that = this;
            //监听是否登陆成功
            that.socket.on('loginSuccess', function() {
                that.div.style.display = "none";
                that.textarea.focus();
            });
            //监听昵称是否被占用
            that.socket.on("Existed", function() {
                alert("该昵称被占用");
                that.maskInit();
            });
            //监听加入和离开，参数：加入者（离开者）名字，在线人数，状态（加入或离开），所以用户数组;
            that.socket.on('system', function(nickName, Count, type, users) {
                var msg = nickName + (type == 'login' ? ' 加入' : ' 离开');
                var p = document.createElement('p');
                var names = "";
                p.textContent = msg;
                p.className = "ac";
                that.view.appendChild(p); //提醒有人加入或离开
                users.forEach(function(user, index) {
                    names += "," + user;
                })
                that.userCount.textContent = Count + (Count > 1 ? ' users' : ' user') + ' 在线' + names;
                that.scroll(55);
            });
            //监听新消息
            that.socket.on('newMsg', function(name, msg) {
                that.displayNewMsg(name, msg);
            });

        },
        /////////////////////////////////////////////////////////////////
        //显示消息
        displayNewMsg: function(user, msg) {
            var that = this;
            var p = document.createElement('p');
            var span = document.createElement('span');
            var p2 = document.createElement('p');
            span.className = "name";
            span.textContent = user;
            p2.innerHTML = that.replace_em(msg);
            p.appendChild(span);
            p.appendChild(p2);
            p.className = "msg";
            if (user == that.name) {
                p.className = p.className + " textright"
            } else {
                p.className = p.className + " textleft"
            }

            that.view.appendChild(p);
            var allp = document.getElementsByTagName("p");
            var lastp = allp[allp.length - 1];
            that.scroll(lastp.offsetHeight + 15);

        },
        //滚动屏幕
        scroll: function(y) {
            var that = this;
            that.view.scrollTop = that.view.scrollTop + y;
        },
        //替换字符
        replace_em: function(str) {
            str = str.replace(/\</g, '<;');
            str = str.replace(/\>/g, '>;');
            str = str.replace(/\n/g, '<;br/>；');
            str = str.replace(/\[em_([0-9]*)\]/g, '<img src="face/$1.gif" border="0" />');
            return str;
        },
        //表情初始化
        emojiInit: function() {
            $('.emotion').qqFace({
                assign: 'content', //给输入框赋值 
                path: 'face/' //表情图片存放的路径 
            });
        },
        init: function() {
            this.maskInit();
            this.eventInit();
            this.socketInit();
            this.emojiInit();

        }

    }


//运行//////////////////////////


      Init.init();

/////////////////////////////////  



})()
