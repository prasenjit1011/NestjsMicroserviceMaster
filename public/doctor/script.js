$(document).ready(function () {
    $('#addCss').click();
    // Load checkbox states from cookies
    $('.faq li').each(function () {
    const id = $(this).data('id');
    const isChecked = Cookies.get(id) === 'true';
    $(this).find('.faq-checkbox').prop('checked', isChecked);
    if (isChecked) {
    $(this).find('.answer').show();
    }
    });
    
    // On checkbox change: save state + show/hide answer
    $('.faq-checkbox').change(function (e) {
    e.stopPropagation(); // prevent parent <li> click
    const parentLi = $(this).closest('li');
    const id = parentLi.data('id');
    const isChecked = $(this).is(':checked');
    Cookies.set(id, isChecked, { expires: 365 }); // 1-year expiry
    
    if (isChecked) {
    parentLi.find('.answer').slideDown();
    } else {
    parentLi.find('.answer').slideUp();
    }
    });
    
    // On question text click: toggle answer (not checkbox)
    $('.faq-question').click(function () {
    const parentLi = $(this).closest('li');
    const answer = parentLi.find('.answer');
    answer.slideToggle();
    });
    });

$('#addCss').on('click', function() {
if ($('#dynamic-css').length === 0) {
    $('head').append('<link id="dynamic-css" rel="stylesheet" href="stylesdark.css" type="text/css" />');
}
});

$('#removeCss').on('click', function() {
$('#dynamic-css').remove();
});
    