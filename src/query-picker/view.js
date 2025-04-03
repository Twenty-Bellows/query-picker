//TODO: We don't need everything from glide
//require ('../../libraries/glide/glide.js');

document.addEventListener('DOMContentLoaded', function () {

	document.querySelectorAll('.is-carousel-query').forEach(glideInstance => {

		// we assume the first child is the content wrapper
		const content = glideInstance.firstElementChild;

		//create a track for the slides
		const track = document.createElement('div');
		track.classList.add('glide__track');
		track.setAttribute('data-glide-el', 'track');

		//create a container for the slides
		const slideContainer = document.createElement('ul');
		slideContainer.classList.add('glide__slides');
		track.appendChild(slideContainer);

		Array.from(content.childNodes).forEach(slideContent => {
			const slideItem = document.createElement('li');
			slideItem.classList.add('glide__slide');
			slideItem.appendChild(slideContent);
			slideContainer.appendChild(slideItem);
		});

		content.replaceWith(track);

		// if there is a wp-block-buttons we'll use that as the controls
		const controls = glideInstance.querySelector('.wp-block-buttons');
		if (controls) {
			controls.setAttribute('data-glide-el', 'controls');
			const buttons = Array.from(controls.querySelectorAll('.wp-block-button'));
			buttons[0]?.setAttribute('data-glide-dir', '<');
			buttons[1]?.setAttribute('data-glide-dir', '>');
		}

		const glideOptions = {
			type: 'carousel',
		};

		if (glideInstance.classList.contains('carousel-two-up')) {
			glideOptions.perView = 2;
			glideOptions.breakpoints = {
				...glideOptions.breakpoints,
				700: {
					perView: 1,
				}
			};
		}

		if (glideInstance.classList.contains('carousel-peek')) {
			glideOptions.peek = 50;
		}

		if (glideInstance.classList.contains('carousel-auto')) {
			glideOptions.autoplay = 10000;
		}

		new Glide(glideInstance, glideOptions).mount();
	});

});
