$(document).ready(function () {
    $("#donate-why").on("click", function () {
        $('#imagepreview').attr('src', 'Img/N3-donations-popup.jpg'); // here asign the image to the modal when the user click the enlarge link
        $('#imagemodal').modal('show'); // imagemodal is the id attribute assigned to the bootstrap modal, then i use the show function
    });
});