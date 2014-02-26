(function($){
	
	
	// CommunityVideo constructor jsPure
	var CommunityVideo = function(element){
		
		// Id único
		this.key = (new Date().getTime()).toString(16);
		this.video	= element;
		
		// Options
		this.options = {
		
			controllers : ['progress','playToggle','volume','time','fullscreen'],
			width		: '480px',
			height		: '320px',
			theme		: 'youtube'
				
		};
		
		// Estructurador
		this.structure();
		
		// Registrando
		this.registrar();
		
		// Eventos
		this.evento();
		
	}
		
	// Estructurador
	CommunityVideo.prototype.structure = function(){
			
		// Contenedor
		$(this.video).wrapAll('<section data-video-role="CommunityVideo" data-video-key="'+this.key+'" data-video-theme="'+this.options.theme+'" style="width:'+this.options.width+';height'+this.options.height+';"/>');

		// Remuevo los controles nativos
		$(this.video).attr('id',this.key).removeProp('controls'); 

		// Controllers
		var controllers = new Array(),
			include		= '';

			controllers['playToggle']	= '<input type="button" data-video-role="togglePlay"  data-title="Reproducir" />';
			controllers['progress']		= '<div data-video-role="progress"><span data-video-role="buffer" class="transition" /><span data-video-role="bar" class="transition" /><span data-video-role="timeTo" style="display:none;">00:00</span><span data-video-role="pointer"></span></div>';
			controllers['time']			= '<time data-video-role="time"><span data-video-role="timeCurrent">00:00</span> /<span data-video-role="timeTotal">00:00</span></time>';
			controllers['volume']		= '<volume data-video-role="volume"><input type="button" data-video-role="toggleVolume" data-title="Silenciar"><div data-video-role="volumeContent" class="transition"><span data-video-role="markVolume"></span><span data-video-role="isVolume" style="width:100%;"></span></div></volume>';
			controllers['fullscreen']	= '<input type="button" data-video-role="toggleFullscreen" data-title="Pantalla Completa">';

		// Controles
		for(var i = 0; i < this.options.controllers.length; i++){

			include += controllers[this.options.controllers[i]];


		}

		// Controllers
		$(this.video).after('<nav data-video-role="nav">'+include+'</nav>');
		
	}	
	
	// Registry
	Registry = new Array();

	// Registro
	CommunityVideo.prototype.registrar = function(){
	
		// Seteo
		Registry[this.key] = document.getElementById(this.key),
		Registry[this.key]['tempVolume'] = 1,
		Registry[this.key]['moveProgressBar'] = false,
		Registry[this.key]['moveVolumeBar'] = false,
		Registry[this.key]['moveHoverTime'] = false;
		Registry[this.key]['interval'] = null;

	}
	
	// Eventos
	CommunityVideo.prototype.evento = function(){
		
		var video	= $('#'+this.key).get(0),
			key		= this.key;
		
		// PlayToggle
		$('[data-video-key="'+this.key+'"]').on('click','nav input:button[data-video-role="togglePlay"]',function(){
			
			playToggle(video,key);
		
		});
		
		// Volume/mute
		$('[data-video-key="'+this.key+'"]').on('click','nav input:button[data-video-role="toggleVolume"]',function(){
			
			volume(video,key);
		
		});
		
		// Movimiento volumen
		$('[data-video-key="'+this.key+'"]').on('click','nav [data-video-role="volumeContent"]',function(e){
			
			moveVolume(e,video,key);
		
		});
		
		$('[data-video-key="'+this.key+'"]').on('mousedown','nav [data-video-role="volumeContent"]',function(e){
			
			// Movemos
			moveVolume(e,video,key);
			
			// Avisamos que lo estamos haciendo
			Registry[key]['moveVolumeBar'] = true;
			
			// Si movemos
			$(this).mousemove(function(e){
				
				if(Registry[key]['moveVolumeBar'])

					// Movemos
					moveVolume(e,video,key);
				
			});
			
			// Si soltamos
			$(this).mouseup(function(e){
				
				// Movemos
				moveVolume(e,video,key);
				
				// Registramos
				Registry[key]['moveVolumeBar'] = false;
				
			});
			
			// Si salimos
			$(window).bind('mouseup',function(){
				
				// Avisamos que salimos de la pagina
				Registry[key]['moveVolumeBar'] = false;
				
			});
		
		});
		
		// Movimiento de barra
		$('[data-video-key="'+this.key+'"]').on('click','nav [data-video-role="progress"]',function(e){
			
			// Movemos
			moveProgress(e,video,key);
		
		});
		
		$('[data-video-key="'+this.key+'"]').on('mousedown','nav [data-video-role="progress"]',function(e){
			
			// Movemos
			moveProgress(e,video,key);
			
			// Avisamos que lo estamos haciendo
			Registry[key]['moveProgressBar'] = true;
			
			// Si movemos
			$(this).mousemove(function(e){
				
				if(Registry[key]['moveProgressBar'])

					// Movemos
					moveProgress(e,video,key);
				
			});
			
			// Si soltamos
			$(this).mouseup(function(e){
				
				// Movemos
				moveProgress(e,video,key);
				
				// Registramos
				Registry[key]['moveProgressBar'] = false;
				
			});
			
			// Si salimos
			$(window).bind('mouseup',function(){
				
				// Avisamos que salimos de la pagina
				Registry[key]['moveProgressBar'] = false;
				
			});
		
		});
		
		// Hover tiempo
		$('[data-video-key="'+this.key+'"] nav [data-video-role="progress"]').hover(function(e){
			
			// Informamos que se esta mostrando
			Registry[key]['moveHoverTime'] = true;
			
			// Mostramos el tooltip
			$(this).find('[data-video-role="timeTo"]').css('display','block');
			
			// Mostramos el tiempo
			hoverTime(e,video,key);
			
			// Movimiento
			$(this).bind('mousemove',function(e){
			
				if(Registry[key]['moveHoverTime'])
					hoverTime(e,video,key);
			
			});
			
		},function(){
		
			// Informamos que se esta mostrando
			Registry[key]['moveHoverTime'] = false;
			
			// Mostramos el tooltip
			$(this).find('[data-video-role="timeTo"]').css('display','none');
		
		
		});
		
		// FullScreen
		$('[data-video-key="'+this.key+'"]').on('click','nav input:button[data-video-role="toggleFullscreen"]',function(){
			
			fullscreen(video,key);
		
		});
	
	}
	
		// [EVENTO] Play/Pause
		playToggle = function(video,key){
			
			var element = $('[data-video-key="'+key+'"] nav [data-video-role="togglePlay"]');
			
			if(!video.paused && !video.ended){

				video.pause();
				element.removeAttr('class');
				clearInterval(Registry[key]['intervalo']);
	
			}else{
	
				video.play();
				element.removeAttr('class').addClass('pause');
				Registry[key]['intervalo'] = setInterval(function(){progress(video,key);},1000);
				
			}
		
		}
		
		// [EVENTO] Progress
		progress = function(element,key){
			
			// Video elemento
			var video	= element,
				nav		= $('[data-video-key="'+key+'"] nav');
			
			// *** Barra de progreso
			if(!video.ended){ 
	
				// DATOS
				var temp 		= (video.currentTime * nav.find('div[data-video-role="progress"]').width()) / video.duration,
					position 	= (video.buffered.end(0) * nav.find('[data-video-role="progress"]').width()) / video.duration;
				
				// ASIGNACION
				nav.find('div [data-video-role="bar"]').css('width',temp+'px');
				nav.find('div [data-video-role="buffer"]').css({width:position});
	
				nav.find('[data-video-role="timeTotal"]').text(ConvertBytes(video.duration));
				nav.find('[data-video-role="timeCurrent"]').text(ConvertBytes(video.currentTime));	
	
			}else{ 
	
				// PlayImage
				nav.find('[data-video-role="togglePlay"]').removeClass('pause').addClass('replay');
	
				// Time
				nav.find('[data-video-role="timeTotal"],[data-video-role="timeCurrent"]').text('00:00');
	
				// ProgressBar
				nav.find('[data-video-role="bar"]').width('100%');
				
				window.clearInterval(Registry[key]['intervalo']);
				
				alert(Registry[key]['intervalo']);
				
			}
			
		}
		
		// [EVENTO] FullScreen
		fullscreen = function(video,key){
		
			var element = $('[data-video-key="'+key+'"] nav [data-video-role="toggleFullscreen"]');

			// minimize
			if(!element.hasClass('minimize')){
	
				// native
				if(video.requestFullscreen) 		video.requestFullscreen();
	
				// moz
				if(video.mozRequestFullScreen) 		video.mozRequestFullScreen();
	
				// webkit
				if(video.webkitRequestFullScreen) 	video.webkitRequestFullScreen();
	
	
				if(!video.requestFullscreen && !video.mozRequestFullScreen && !video.webkitRequestFullScreen) 
					$('[data-video-key="'+key+'"]').addClass('fullScreenOnIE');
	
				// ClassNav
				$('[data-video-key="'+key+'"] [data-video-role="nav"]').addClass('fullScreenOn').css('z-index','2147483647');
				$('[data-video-key="'+key+'"] [data-video-role="toggleFullscreen"]').addClass('minimize');
	
			}else{
	
				// native
				if(document.cancelFullScreen)
					document.cancelFullScreen();
	
				// native2
				if(document.exitFullscreen)
					document.exitFullscreen();
	
				// moz
				if(document.mozCancelFullScreen) 
					document.mozCancelFullScreen();
	
				// webkit
				if(video.webkitExitFullscreen)
					video.webkitExitFullscreen();
	
				if(!document.cancelFullScreen && !document.exitFullscreen && !document.mozCancelFullScreen && !video.webkitExitFullscreen) 
					$('[data-key="'+key+'"]').removeClass('fullScreenOnIE');
	
				// ClassNav
				$('[data-video-key="'+key+'"] [data-video-role="nav"]').removeClass('fullScreenOn').css('z-index','');
				$('[data-video-key="'+key+'"] [data-video-role="toggleFullscreen"]').removeClass('minimize');
	
	
			}

		}
		
		// [EVENTO] Volumen/Mute
		volume = function(video,key){
		
			var volume = $('[data-video-key="'+key+'"] [data-video-role="toggleVolume"]');
	
			if(volume.hasClass('mute')){
	
				video.volume = Registry[key]['tempVolume'];
				volume.removeClass('mute');
				$('[data-video-key="'+key+'"] [data-video-role="isVolume"]').width((Registry[key]['tempVolume']*100)+'%');
	
			}else{
	
				Registry[key]['tempVolume'] = video.volume;
				volume.addClass('mute');
				video.volume = 0;
				$('[data-video-key="'+key+'"] [data-video-role="isVolume"]').width('5px');
	
			}

		}
		
		// [EVENTO] Movimiento del volumen
		moveVolume = function(e,video,key){
		
			var ratonX	= e.pageX - $('[data-video-key="'+key+'"] [data-video-role="volumeContent"]').offset().left,
				newDate	= ratonX / $('[data-video-key="'+key+'"] [data-video-role="volumeContent"]').width();

			video.volume = newDate;
	
			$('[data-video-key="'+key+'"] [data-video-role="isVolume"]').width(ratonX+'%');

		}
		
		// [EVENTO] Muestra el tiempo
		hoverTime = function(e,video,key){
		
			var	nav		= $('[data-video-key="'+key+'"] nav');
	
			// Necesito saber el tiempo total, el tiempo en el que necesito
			var widthTotal = nav.find('[data-video-role="progress"]').width(),
				outerWidth = nav.find('[data-video-role="timeTo"]').outerWidth(),
				ratonX	= e.pageX - nav.find('[data-video-role="progress"]').offset().left,
				newDate	= ratonX * video.duration / widthTotal;
	
	
			// Pasando al hover
			nav.find('[data-video-role="timeTo"]').text(ConvertBytes(newDate));
	
			if((ratonX + outerWidth) < widthTotal)
				nav.find('[data-video-role="timeTo"]').css('left',ratonX+'px')
			else
				nav.find('[data-video-role="timeTo"]').css('left',(widthTotal-outerWidth)+'px')

		}
		
		// [EVENTO] Mueve el progreso
		moveProgress = function(e,video,key){
			
			var key	= $('[data-video-key="'+key+'"] nav');

			if(!video.paused && !video.ended){
	
				var ratonX	= e.pageX - key.find('[data-video-role="progress"]').offset().left,
					newDate	= ratonX * video.duration / key.find('[data-video-role="progress"]').width();
	
				video.currentTime = newDate;			
	
				key.find('[data-video-role="progress"]').find('[data-video-role="bar"]').css('width',ratonX+'px');
	
			}
			
		}
		
		// [UTILIDAD] Conversor de bytes
		ConvertBytes = function(seg_ini){
		
			var horas = Math.floor(seg_ini/3600);
			var minutos = Math.floor((seg_ini-(horas*3600))/60);
			var segundos = Math.round(seg_ini-(horas*3600)-(minutos*60));
	
			if(horas.toString().length==1) horas = '0'+horas+':';
			if(horas=='00:') horas = '';
			if(minutos.toString().length==1) minutos = '0'+minutos;
			if(segundos.toString().length==1) segundos = '0'+segundos;
	
			return horas+minutos+':'+segundos;
	
		}
		
	
	// Constructor jQuery
	$.fn.CommunityVideo = function(options){
		
		return this.each(function(element,index){
				
			var $this = $(this);
			var data  = $this.data('CommunityVideo');
			
			var options = $.extend(CommunityVideo.default,options);

			if (!data) $this.data('CommunityVideo', (data = new CommunityVideo(this, options)));
			
			if (typeof option == 'string') data[option].call($this);	
				
		});
		
	}
	
	$.fn.CommunityVideo.Constructor = CommunityVideo;
	
})(jQuery);