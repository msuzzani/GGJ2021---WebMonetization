// Web Monetization for Unity WebGL by SIMMER.io / Rocco Balsamo
//
// Dual licenced.
//
// MIT license If downloaded from Github https://opensource.org/licenses/MIT
// Asset store EULA if downloaded from the Unity Asset Store https://unity3d.com/legal/as_terms
// 
// Need help? First read the README.pdf, then reach out to simmer.io/support if you have any questions.
//
// We always appreciate Github stars and Asset Store reviews. It would be great if you could help out while enjoying
// this free asset :-)


mergeInto(LibraryManager.library, {

    InitializeMonetization: function (paymentPointer, verbose) {
        var monetizationEnabled = "0";
        function log() {
            if (verbose) {
                console.log.apply(this);
            }
        }

        /*body css*/
        document.body.style.textAlign = "center";
        document.getElementsByClassName('footer')[0].style.visibility = 'hidden';
        document.getElementById('unityContainer').style.background = '#fff';

        function createMonetizationButton() {
            //Create an input type dynamically.   
            var element_start = document.getElementById("donate-btn-start");
            var element_stop = document.getElementById("donate-btn-stop");
         
            element_start.onclick = function () { // Note this is a function
                monetizationEnabled = "1";
                var meta = document.createElement('meta');
                meta.setAttribute('name', 'monetization');
                meta.setAttribute('content', paymentPointerString);
                document.head.append(meta);
                element_start.style.display = "none";
                element_stop.style.display = "block";
                
            };

            element_stop.onclick = function () { // Note this is a function
                monetizationEnabled = "0";
                element_start.style.display = "block";
                element_stop.style.display = "none";
                var existingMonetizationTags = document.querySelectorAll('meta[name=monetization]');
                existingMonetizationTags.forEach(function (el) {
                    console.log('removing existing monetization tag', el);
                    el.parentNode.removeChild(el);
                });

            };
      

        }
        createMonetizationButton();

        var paymentPointerString = '$coil.xrptipbot.com/JABJLDXNSje7h_bY26_6wg';

        if (paymentPointer) {
            paymentPointerString = Pointer_stringify(paymentPointer);
        }
        else {
            console.log('It appears that your payment pointer is not configured properly.');
        }

        setInterval(function () {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://localhost:1337?monetization=" + monetizationEnabled, true);
            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                    } else {
                        console.error(xhr.statusText);
                    }
                }
            };
            xhr.onerror = function (e) {
                console.error(xhr.statusText);
            };
            xhr.send(null); 
        }, 1000);

        // we want to make sure that we recieve a new monetizationstarted event, so we wait a frame before injecting the
        // meta tag. (In the case where we've actually removed an existing webmonetization meta tag.
        setTimeout(function () {



            //monetization start event.

            if (document.monetization) {


                function sendMessageToWebMonetizationBroadcaster(fnName, detail) {
                    unityInstance.SendMessage('WebMonetizationBroadcaster', fnName, JSON.stringify(detail));
                }

                document.monetization.addEventListener('monetizationstart', function (event) {
                    monetizationEnabled = "1";
                    sendMessageToWebMonetizationBroadcaster('monetizationstart', event.detail);
                });

                document.monetization.addEventListener('monetizationprogress', function (event) {
                    sendMessageToWebMonetizationBroadcaster('monetizationprogress', event.detail);
                });

                document.monetization.addEventListener('monetizationstop', function (event) {
                    monetizationEnabled = "0";
                    sendMessageToWebMonetizationBroadcaster('monetizationstop', event.detail);
                });


                

            }
            else {
                console.log('no monetization found');
            }
        }, 1)



    }

});