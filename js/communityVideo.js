(function($){

	// Array Multidimensiona
	var videos = new Array();

	$.fn.ComunityVideo = function(option){
	
		// Definiendo opciones
		options = $.extend($.fn.ComunityVideo.default,option);

		// 
		$(this).each(function(index, element){

			// uniqId
			var uniqId = (new Date().getTime()).toString(16);

			// WapperVideo
			$.fn.ComunityVideo._Wrapper(element,uniqId);

			// Registrar
			$.fn.ComunityVideo.Registry(uniqId);

        });

		// Eventos
		$.fn.ComunityVideo._Events(uniqId);

	}

	// --- Wrapper
	$.fn.ComunityVideo._Wrapper = function(element,uniqId){
	
		// Contain
		$(element).wrapAll('<section data-role="ComunityVideo" data-key="'+uniqId+'" data-theme="'+options.theme+'" style="width:'+options.width+';height'+options.height+';"/>');

		// Remove ControllsNative
		$(element).attr('id',"ComunityVideo_"+uniqId).removeAttr('controls'); 

		// Controllers
		var controllers = new Array(),
			include		= '';

			controllers['playToggle']	= '<input type="button" data-id="ComunityVideo_togglePlay"  data-title="Reproducir" />';
			controllers['progress']		= '<div data-id="ComunityVideo_progress"><span data-id="ComunityVideo_buffer" class="transition" /><span data-id="ComunityVideo_progress_bar" class="transition" /><span data-id="ComunityVideo_time_to" style="display:none;">00:00</span><span data-id="ComunityVideo_progress_pointer"></span></div>';
			controllers['time']			= '<time data-id="ComunityVideo_time"><span data-id="ComunityVideo_time_current">00:00</span> /<span data-id="ComunityVideo_time_total">00:00</span></time>';
			controllers['volume']		= '<volume data-id="ComunityVideo_volume"><input type="button" data-id="ComunityVideo_toggleVolume" data-title="Silenciar"><div data-id="ComunityVideo_volume_content" class="transition"><span data-id="ComunityVideo_markVolume"></span><span data-id="ComunityVideo_isVolume" style="width:100%;"></span></div></volume>';
			controllers['fullscreen']	= '<input type="button" data-id="ComunityVideo_toggleFullscreen" data-title="Pantalla Completa">';

		// Controles
		for(var i = 0; i < options.controllers.length; i++){

			include += controllers[options.controllers[i]];


		}

		// Controllers
		$(element).after('<nav data-role="nav">'+include+'</nav>');

	}

	// --- Create Registry
	$.fn.ComunityVideo.Registry = function(uniqId){
	
		// Seteo
		videos[uniqId] = document.getElementById('ComunityVideo_'+uniqId),
		videos[uniqId]['tempVolume'] = 1,
		videos[uniqId]['moveProgressBar'] = false,
		videos[uniqId]['moveVolumeBar'] = false,
		videos[uniqId]['moveHoverTime'] = false;

	}

	// ---- Eventos
	$.fn.ComunityVideo._Events = function(uniqId){

		key			= '[data-key="'+uniqId+'"]';

		// playToggle
		$(key+' [data-id="ComunityVideo_togglePlay"]').bind('click',function(){
		
			$.fn.ComunityVideo.playToggle(uniqId,$(this));

		});

		// Progress Click & Move
		$(key+' [data-id="ComunityVideo_progress"]').bind('click',function(e){
		
			$.fn.ComunityVideo.progressMove(e,uniqId,$(this));

		});

		// Progress
		$(key+' [data-id="ComunityVideo_progress_pointer"]').mousedown(function(e){
		
			// Move
			$.fn.ComunityVideo.progressMove(e,uniqId,$(key+' [data-id="ComunityVideo_progress"]'));

			// Advance
			videos[uniqId]['moveProgressBar'] = true;

			$(document).bind('mousemove',function(e){

				if(videos[uniqId]['moveProgressBar'] == true){

					$.fn.ComunityVideo.progressMove(e,uniqId,$(key+' [data-id="ComunityVideo_progress"]'));

				}

			});

			$(document).bind('mouseup',function(e){

				videos[uniqId]['moveProgressBar'] = false;

			})

		});

		// Volume
		$(key+' [data-id="ComunityVideo_isVolume"]').mousedown(function(e){
		
			// Move
			$.fn.ComunityVideo.volume(e,uniqId);

			// Advance
			videos[uniqId]['moveVolumeBar'] = true;

			$(document).bind('mousemove',function(e){

				if(videos[uniqId]['moveVolumeBar'] == true){

					$.fn.ComunityVideo.volume(e,uniqId);

				}

			});

			$(document).bind('mouseup',function(e){

				videos[uniqId]['moveVolumeBar'] = false;

			})

		});

		// Fullscreen
		$(key+' [data-id="ComunityVideo_toggleFullscreen"]').bind('click',function(){
		
			$.fn.ComunityVideo.toggleFullScreen(uniqId);

		});

		// Volume
		$(key+' [data-id="ComunityVideo_toggleVolume"]').bind('click',function(){
		
			$.fn.ComunityVideo.toggleVolume(uniqId);

		});

		$(key+' [data-id="ComunityVideo_volume_content"]').bind('click',function(e){
		
			$.fn.ComunityVideo.volume(e,uniqId);

		});


	}

	// ---- Controles
	$.fn.ComunityVideo.progressMove = function(e,uniqId,progress){

		var video	= videos[uniqId],
		key			= '[data-key="'+uniqId+'"]';

		if(!video.paused && !video.ended){

			var ratonX	= e.pageX - $(progress).offset().left,
				newDate	= ratonX * video.duration / $(progress).width();

			video.currentTime = newDate;			

			$(progress).find('[data-id="ComunityVideo_progress_bar"]').css('width',ratonX+'px');

		}

	}







})(jQuery);