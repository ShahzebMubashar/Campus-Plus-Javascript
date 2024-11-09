document.addEventListener("DOMContentLoaded", function () {
    var myBtn = document.getElementById("myBtn");
    var progressCircle = document.querySelector('.progress-ring__circle');

    if (progressCircle) {
        var radius = progressCircle.r.baseVal.value;
        var circumference = 2 * Math.PI * radius;

        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;

        function setProgress(percent) {
            const offset = circumference - (percent / 100 * circumference);
            progressCircle.style.strokeDashoffset = offset;
        }

        function updateProgress() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            
            setProgress(scrollPercent);
        }

        window.addEventListener('scroll', function () {
            // Always show the button regardless of scroll position
            myBtn.style.display = "flex";  // Ensure button is always visible

            // Update progress circle
            updateProgress();
        });

        myBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Initial update when the page loads
        updateProgress();
    } else {
        console.warn("Element '.progress-ring__circle' not found in the DOM.");
    }
});
