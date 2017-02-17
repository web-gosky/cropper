$(function() {

	var winWidth;
	if(window.innerWidth) {
		winWidth = window.innerWidth;
	} else if((document.body) && (document.body.clientWidth)) {
		winWidth = document.body.clientWidth;
	}
	var wiDth = parseFloat(winWidth);
	$(".page").height(11 / 9 * wiDth);
	var Width = $(".container").width()
	$(".container").height(11 / 9 * Width);

	$(window).resize(function() {
		if(window.innerWidth) {
			winWidth = window.innerWidth;
		} else if((document.body) && (document.body.clientWidth)) {
			winWidth = document.body.clientWidth;
		}
		var wiDth = parseFloat(winWidth);
		$(".page").height(11 / 9 * wiDth);
		var Width = $(".container").width()
		$(".container").height(11 / 9 * Width);

	});

	function utf16to8(str) {
		var out, i, len, c;
		out = "";
		len = str.length;
		for(i = 0; i < len; i++) {
			c = str.charCodeAt(i);
			if((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i);
			} else if(c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
				out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			} else {
				out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			}
		}
		return out;
	}

	function utf8to16(str) {
		var out, i, len, c;
		var char2, char3;
		out = "";
		len = str.length;
		i = 0;
		while(i < len) {
			c = str.charCodeAt(i++);
			switch(c >> 4) {
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
					// 0xxxxxxx
					out += str.charAt(i - 1);
					break;
				case 12:
				case 13:
					// 110x xxxx 10xx xxxx
					char2 = str.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
					break;
				case 14:
					// 1110 xxxx 10xx xxxx 10xx xxxx
					char2 = str.charCodeAt(i++);
					char3 = str.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
					break;
			}
		}
		return out;
	}

	/*
	 * Interfaces:
	 * b64 = base64encode(data);
	 * data = base64decode(b64);
	 */
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
	var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
		52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
		15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
		41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

	function base64encode(str) {
		var out, i, len;
		var c1, c2, c3;
		len = str.length;
		i = 0;
		out = "";
		while(i < len) {
			c1 = str.charCodeAt(i++) & 0xff;
			if(i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt((c1 & 0x3) << 4);
				out += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if(i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
				out += base64EncodeChars.charAt((c2 & 0xF) << 2);
				out += "=";
				break;
			}
			c3 = str.charCodeAt(i++);
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
			out += base64EncodeChars.charAt(c3 & 0x3F);
		}
		return out;
	}

	function base64decode(str) {
		var c1, c2, c3, c4;
		var i, len, out;
		len = str.length;
		i = 0;
		out = "";
		while(i < len) {
			/* c1 */
			do {
				c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while (i < len && c1 == -1);
			if(c1 == -1) break;
			/* c2 */
			do {
				c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while (i < len && c2 == -1);
			if(c2 == -1) break;
			out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
			/* c3 */
			do {
				c3 = str.charCodeAt(i++) & 0xff;
				if(c3 == 61) return out;
				c3 = base64DecodeChars[c3];
			} while (i < len && c3 == -1);
			if(c3 == -1) break;
			out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
			/* c4 */
			do {
				c4 = str.charCodeAt(i++) & 0xff;
				if(c4 == 61) return out;
				c4 = base64DecodeChars[c4];
			} while (i < len && c4 == -1);
			if(c4 == -1) break;
			out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
		}
		return out;
	}
	var safe64 = function(base64) {
		base64 = base64.replace(/\+/g, "-");
		base64 = base64.replace(/\//g, "_");
		return base64;
	};
	var token;
	genToken = function(accessKey, secretKey, putPolicy) {

		//SETP 2
		var put_policy = JSON.stringify(putPolicy);
		console.log("put_policy = ", put_policy);

		//SETP 3
		var encoded = base64encode(utf16to8(put_policy));
		console.log("encoded = ", encoded);

		//SETP 4
		var hash = CryptoJS.HmacSHA1(encoded, secretKey);
		var encoded_signed = hash.toString(CryptoJS.enc.Base64);

		//SETP 5
		var upload_token = accessKey + ":" + safe64(encoded_signed) + ":" + encoded;

		return upload_token;
	};
	var policy = new Object();
	var bucketName = "tapsbook";
	var accessKey = "vZcav3MsPU7CoHGiHTeaYsW8FxfPPrI2QQBTGGTV";
	var secretKey = "WpiUJrEMEmNnpPjvfX4HR8ii_iG2GphbU9uk4HEN";
	policy.scope = bucketName;
	var deadline = Math.round(new Date().getTime() / 1000) + 1 * 3600
	policy.deadline = deadline;
	token = genToken(accessKey, secretKey, policy);
	console && console.log("token=", token);
	$("#token").val(token)
	//生成token
			$('.slot img').cropper({ //不同
				//preview: ".container",
				aspectRatio: 202 / 247, //裁剪比例，NaN-自由选择区域
				modal: false,
				resizable: false,


				crop: function(data) {
					// Output the result data for cropping image.
			
					json = [
						'{"x":' + data.x,
						'"y":' + data.y,
						'"height":' + data.height,
						'"width":' + data.width,
						'"rotate":' + data.rotate + '}'
					].join();

					console.log(json);

				}
			});
	var $key = $('#key'); // file name    eg: the file is image.jpg,but $key='a.jpg', you will upload the file named 'a.jpg'
	var $userfile = $('#userfile'); // the file you selected
	var $selectedFile = $('.selected-file');
	var $progress = $(".progress");
	var $uploadedResult = $('.uploaded-result');
	var url1;
	$("#userfile").change(function() { // you can ues 'onchange' here to uplpad automatically after select a file
		$(".container").attr("for", "");
		var file = this.files[0];
		fileName = file.name;
		var reader = new FileReader();
		//reader回调，重新初始裁剪区
		reader.onload = function() {
			// 通过 reader.result 来访问生成的 DataURL
			url1 = reader.result;
			//选择图片后重新初始裁剪区
			$('.container img').attr('src', url1);
			$('.slot img').attr('src', url1);
						
	
		};
		reader.readAsDataURL(file);
		//		$.ajax({
		//			url: "https://dashboard.shiyi.co/api/v1/qiniu/upload_token",
		//			type: "post",
		//		
		//			
		//			data: {
		//				bucket_name: 'tapsbook',
		//				file_key: 
		//
		//			},
		//			success: function(result) {
		//				console.log(result);
		//
		//			}
		//		});
		$uploadedResult.html('');
		var selectedFile = $userfile.val();
		if(selectedFile) {
			// randomly generate the final file name
			var ramdomName = Math.random().toString(36).substr(2) + $userfile.val().match(/\.?[^.\/]+$/);
			$key.val(ramdomName);
			$selectedFile.html('文件：' + selectedFile);
		} else {
			return false;
		}
		var f = new FormData(document.getElementById("testform"));
		$.ajax({
			url: 'http://upload.qiniu.com/', // Different bucket zone has different upload url, you can get right url by the browser error massage when uploading a file with wrong upload url.
			type: 'POST',
			data: f,
			processData: false,
			contentType: false,
			xhr: function() {
				myXhr = $.ajaxSettings.xhr();
				if(myXhr.upload) {
					myXhr.upload.addEventListener('progress', function(e) {
						console.log(e);
						if(e.lengthComputable) {
							var percent = e.loaded / e.total * 100;
							$progress.html('上传：' + e.loaded + "/" + e.total + " bytes. " + percent.toFixed(2) + "%");
							$("#bar").width(+percent.toFixed(2) + "%");
							$("#bar").html(+percent.toFixed(2) + "%");
							if(percent.toFixed(2) == 100) {
								$("#bar").html("上传成功");
							}

						}
					}, false);
				}
				return myXhr;
			},
			success: function(res) {
				console.log("成功：" + JSON.stringify(res.key));
				//				var str = '<span>已上传：' + res.key + '</span>';
				//				if(res.key && res.key.match(/\.(jpg|jpeg|png|gif)$/)) {
				//					$(".sort img").attr("src", domain + res.cc;
				//				}
				//				$uploadedResult.html(str);

			},
			error: function(res) {
				console.log("失败:" + JSON.stringify(res));
				$uploadedResult.html('上传失败：' + res.responseText);
			}
		});
		return false;
	});
	$(".container").click(function() {
		if($(this).attr("for") == "") {
			$(".btngroup").show();
		} else {

		}
	})
	var json;
	$(".cancal").click(function() {
		$(".btngroup").hide();
	}) //取消
	$(".edit").click(function() {
					
				$('.slot > img').cropper('replace',$(".container img").attr("src"));
		$(".btngroup").hide();

		$(".fixed").show();

		$(".fixed_head").show();
		$(".fixed_bottom").show();
		$(".slot").show();

		$(".page").hide();


	}) //编辑照片
	$(".new").click(function() {
		$(".container").attr("for", "userfile");
			$('.slot > img').cropper('reset',true);
		$(".container").trigger('click');
		$(".btngroup").hide();
		
//			var $image = $('.slot > img');
//		var dataURL = $image.cropper("getCroppedCanvas"); //找死了
//		var imgurl = dataURL.toDataURL("image/png", 1.0); //这里转成base64 image，img的src可直接使用
//		$(".container img").attr("src", imgurl);
//		$(".slot img").attr("src", imgurl);
//

		

	}) //重新上传

	$(".cancelone").click(function() {
		//			css

		$(".fixed").hide();
		$(".fixed_head").hide();
		$(".fixed_bottom").hide();
		$(".page").show();
		$(".slot").hide();
	}) //取消
	$(".confirm").click(function() {
		$(".fixed").hide();
		$(".fixed_head").hide();
		$(".fixed_bottom").hide();

		$(".page").show();
		$(".slot").hide();
		var $image = $('.slot > img');
		var dataURL = $image.cropper("getCroppedCanvas"); //找死了
		var imgurl = dataURL.toDataURL("image/png", 1.0); //这里转成base64 image，img的src可直接使用
		$(".container img").attr("src", imgurl);
		$(".slot img").attr("src", imgurl);

		$('.slot > img').cropper('replace', imgurl);

	}) //确ding
	$(".add").click(function() {
		$('.slot > img').cropper('zoom', 0.1);

	})
	$(".reduce").click(function() {
		$('.slot > img').cropper('zoom', -0.1);

	})
	$(".left").click(function() {
		$('.slot > img').cropper('rotate', -90)

	})
	$(".right").click(function() {
		$('.slot > img').cropper('rotate', 90)

	})
})