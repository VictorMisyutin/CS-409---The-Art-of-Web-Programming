(() => {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        header.classList.toggle('small', window.scrollY > 50);
    });

    document.addEventListener("DOMContentLoaded", () => {
        const sections = document.querySelectorAll(".section");
        const links = {
            "welcome-section": document.getElementById("welcome-link"),
            "scenic-section": document.getElementById("scenic-link"),
            "social-section": document.getElementById("social-link"),
            "carousel-section": document.getElementById("carousel-link"),
        };

        const setActiveLink = () => {
            let index = sections.length;

            while (--index && window.scrollY + 250 < sections[index].offsetTop) {}

            for (const key of Object.keys(links)) {
                links[key].classList.remove("active-section-link");
            }

            const currentSection = sections[index];
            if (currentSection) {
                links[currentSection.id].classList.add("active-section-link");
            }
        };

        window.addEventListener("scroll", setActiveLink);
        setActiveLink();

        const buttons = document.querySelectorAll(".modal-btn");
        const modals = document.querySelectorAll(".modal");
        const closeButtons = document.querySelectorAll(".close");

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const modalId = button.getAttribute("data-modal");
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.style.display = "block";
                }
            });
        });

        closeButtons.forEach((closeBtn) => {
            closeBtn.addEventListener("click", () => {
                const modal = closeBtn.closest(".modal");
                if (modal) {
                    modal.style.display = "none";
                }
            });
        });

        window.addEventListener('click', (event) => {
            modals.forEach((modal) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    });

    const descriptions = [
        `This is a Snowdrop flower, also known as Galanthus. It is native to Europe and the Middle East. They usually bloom in the spring and have three outer petals and three inner petals. Snowdrops are one of the first flowers to bloom, often emerging from the snow, symbolizing hope and renewal. These delicate flowers are known for their nodding heads and can be found in woodlands and gardens, providing a beautiful contrast against the lingering winter landscape. They are also considered a sign that spring is on its way, often bringing joy after the long winter months.`,
        
        `This is a Dandelion, known scientifically as Taraxacum. It's a common flower that blooms in spring and summer. The flower head turns into a puffball of seeds, which can be blown away by the wind. Dandelions are often considered weeds, but they are rich in nutrients and have been used in herbal medicine for centuries. The entire plant is edible, from the roots to the leaves, and has numerous health benefits. Dandelions are also important for wildlife, providing nectar for bees and other pollinators, and their bright yellow flowers add vibrant color to fields and gardens.`,
        
        `This is Lavender, known for its fragrant purple flowers. Lavender is often used in perfumes and essential oils, and it attracts pollinators such as bees. Beyond its aromatic properties, lavender is also celebrated for its calming effects and is frequently used in aromatherapy and relaxation products. The plant thrives in sunny, dry conditions and is commonly grown in herb gardens. Lavender is not only valued for its beauty and scent but also for its culinary uses, often featured in desserts, teas, and savory dishes, adding a unique flavor profile.`
    ];

    let currentIndex = 0; 

    const scrollSlider = (direction) => {
        const slider = document.querySelector('.slider');
        const scrollAmount = slider.offsetWidth;

        currentIndex += direction;

        if (currentIndex < 0) {
            currentIndex = 0;
        } else if (currentIndex >= descriptions.length) {
            currentIndex = descriptions.length - 1;
        }

        slider.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });

        document.getElementById('carousel-image-description').innerText = descriptions[currentIndex];
    };

    document.getElementById('carousel-image-description').innerText = descriptions[currentIndex];

    window.scrollSlider = scrollSlider;
})();
