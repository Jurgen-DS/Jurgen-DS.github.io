// M.AutoInit();

$(document).ready(function () {

    $('.nav a').on('click', function() {
        // Remove active class from all links in nav
        $('.nav a').removeClass('active');
        
        // Add active class to the clicked link
        $(this).addClass('active');
    });

    // Trigger nav burger animation
    $(".main-nav-toggle").click(function (event) {
        event.stopPropagation();
        $(this).toggleClass('active-menu');
        $(".nav").toggleClass('active-menu');
    });

    $(document).click(function () {
        if ($(".main-nav-toggle").hasClass('active-menu')) {
            $(".main-nav-toggle").removeClass('active-menu');
            $(".nav").removeClass('active-menu');
        }
    });

    // Scroll event to remove active class from all links
    $(window).bind('mousewheel', function(event){
        if ($(this).scrollTop() > 0) {
            $('.nav a').removeClass('active');
        }
    });

    // Scroll event to add/remove top class to nav
    $(window).scroll(function() {
        if ($(this).scrollTop() == 0) {
            $('#home').addClass('active')
            $('.nav').removeClass('scrolled');
        } else {
            $('.nav').addClass('scrolled'); 
        }
    });

    var home = document.querySelectorAll('#HomeCarousel');
    var homeinstance = M.Carousel.init(home, {
        fullWidth: true,    // Makes the carousel span the entire width
        indicators: false,  // Show navigation indicators
        autoplay: true,     // Enables automatic transition
        interval: 6000      // Time between transitions in milliseconds
    });

    // // Manually start autoplay after initialization (optional: Dit zou eingelijk niet nodig moeten zijn, maar krijg het anders niet aan de praat)
    // setInterval(function() {
    //     homeinstance[0].next(); // Manually move to the next slide every 2 seconds
    // }, 6000);

    var projectOne = document.querySelectorAll('#ProjectCarouselOne');
    var projectOneinstance = M.Carousel.init(projectOne, {
        fullWidth: true,    // Makes the carousel span the entire width
        indicators: true,   // Show navigation indicators
        autoplay: true,     // Enables automatic transition
        interval: 2000      // Time between transitions in milliseconds
    });

    // Get the carousel instance
    // var carouselInstanceOne = M.Carousel.getInstance(document.querySelector('#ProjectCarouselOne'));

    // // Previous button action
    // document.getElementById('prev').addEventListener('click', function() {
    //     carouselInstanceOne.prev(); // Go to the previous item
    // });

    // // Next button action
    // document.getElementById('next').addEventListener('click', function() {
    //     carouselInstanceOne.next(); // Go to the next item
    // });

    var projectTwo = document.querySelectorAll('#ProjectCarouselTwo');
    var projectinstance = M.Carousel.init(projectTwo, {
        fullWidth: true,    // Makes the carousel span the entire width
        indicators: true,   // Show navigation indicators
        autoplay: true,     // Enables automatic transition
        interval: 2000      // Time between transitions in milliseconds
    });

    // // Get the carousel instance
    // var carouselInstanceTwo = M.Carousel.getInstance(document.querySelector('#ProjectCarouselTwo'));

    // // Previous button action
    // document.getElementById('prev').addEventListener('click', function() {
    //     carouselInstanceTwo.prev(); // Go to the previous item
    // });

    // // Next button action
    // document.getElementById('next').addEventListener('click', function() {
    //     carouselInstanceTwo.next(); // Go to the next item
    // });

    var projectThree = document.querySelectorAll('#ProjectCarouselThree');
    var projectinstance = M.Carousel.init(projectThree, {
        fullWidth: true,    // Makes the carousel span the entire width
        indicators: true,   // Show navigation indicators
        autoplay: true,     // Enables automatic transition
        interval: 2000      // Time between transitions in milliseconds
    });

    // // Get the carousel instance
    // var carouselInstanceTwo = M.Carousel.getInstance(document.querySelector('#ProjectCarouselTwo'));

    // // Previous button action
    // document.getElementById('prev').addEventListener('click', function() {
    //     carouselInstanceTwo.prev(); // Go to the previous item
    // });

    // // Next button action
    // document.getElementById('next').addEventListener('click', function() {
    //     carouselInstanceTwo.next(); // Go to the next item
    // });


    var gallery = document.querySelectorAll('#GalleryCarousel');
    var galleryinstance = M.Carousel.init(gallery, {
        fullWidth: true,
        indicators: true
    });

    $('.item').click(function() {
        // Get the title and description from the clicked item
        var title = $(this).find('h3').text();  // Extract title from <h3>
        var description = $(this).find('p').text();  // Extract description from <p>)

        // Show gallery details
        $('.selected').addClass('active');

        // Set the title and description to the target item
        $('.selected').find('h3').text(title);
        $('.selected').find('p').text(description);

        // Get the carousel instance
        var galleryinstance = M.Carousel.getInstance(document.querySelector('#GalleryCarousel'));
        galleryinstance.destroy();
        $('#GalleryCarousel').empty();

        $(this).find(".item-details a").each(function(index, image) {
            $('#GalleryCarousel').append($(image).clone());
        });

        galleryinstance = M.Carousel.init(gallery, {
            fullWidth: true,    // Makes the carousel span the entire width
            indicators: true,   // Show navigation indicators
            autoplay: true,     // Enables automatic transition
            interval: 2000      // Time between transitions in milliseconds
        });

        // Get the carousel instance
        var galleryinstance = M.Carousel.getInstance(document.querySelector('#GalleryCarousel'));

        // Previous button action
        document.getElementById('prev').addEventListener('click', function() {
            galleryinstance.prev(); // Go to the previous item
        });

        // Next button action
        document.getElementById('next').addEventListener('click', function() {
            galleryinstance.next(); // Go to the next item
        });
    });

    // Close / hide gallery details
    $('.close-icon, .selected .bg').on('click', function() {
        $('.selected').removeClass('active');
    });

    // Initialize EmailJS
    (function(){
        emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS user ID
    })();

    // Handle form submission
    document.getElementById('form').addEventListener('submit', function(event){
        event.preventDefault();

        // Collect form data
        const user_email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Send email via EmailJS
        emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
            .then(function(response) {
                alert('Email sent successfully!');
                console.log('Success:', response);
            }, function(error) {
                alert('Failed to send email.');
                console.log('Error:', error);
            });
    });
});
