Grocy.Components.ProductPicker = { };

Grocy.Components.ProductPicker.GetPicker = function()
{
	return $('#product_id');
}

Grocy.Components.ProductPicker.GetInputElement = function()
{
	return $('#product_id_text_input');
}

Grocy.Components.ProductPicker.GetValue = function()
{
	return $('#product_id').val();
}

Grocy.Components.ProductPicker.SetValue = function(value)
{
	Grocy.Components.ProductPicker.GetInputElement().val(value);
	Grocy.Components.ProductPicker.GetInputElement().trigger('change');
}

Grocy.Components.ProductPicker.SetId = function(value)
{
	Grocy.Components.ProductPicker.GetPicker().val(value);
	Grocy.Components.ProductPicker.GetPicker().data('combobox').refresh();
	Grocy.Components.ProductPicker.GetInputElement().trigger('change');
}

Grocy.Components.ProductPicker.Clear = function()
{
	Grocy.Components.ProductPicker.SetValue('');
	Grocy.Components.ProductPicker.SetId(null);
}

Grocy.Components.ProductPicker.InProductAddWorkflow = function()
{
	return typeof GetUriParam('createdproduct') !== "undefined" || typeof GetUriParam('product') !== "undefined";
}

Grocy.Components.ProductPicker.InProductModifyWorkflow = function()
{
	return typeof GetUriParam('addbarcodetoselection') !== "undefined";
}

Grocy.Components.ProductPicker.ShowCustomError = function(text)
{
	var element = $("#custom-productpicker-error");
	element.text(text);
	element.removeClass("d-none");
}

Grocy.Components.ProductPicker.HideCustomError = function()
{
	$("#custom-productpicker-error").addClass("d-none");
}

$('.product-combobox').combobox({
	appendId: '_text_input',
	bsVersion: '4',
	clearIfNoMatch: false
});

var prefillProduct = GetUriParam('createdproduct');
var prefillProduct2 = Grocy.Components.ProductPicker.GetPicker().parent().data('prefill-by-name').toString();
if (!prefillProduct2.isEmpty())
{
	prefillProduct = prefillProduct2;
}
if (typeof prefillProduct !== "undefined")
{
	var possibleOptionElement = $("#product_id option[data-additional-searchdata*=\"" + prefillProduct + "\"]").first();
	if (possibleOptionElement.length === 0)
	{
		possibleOptionElement = $("#product_id option:contains(\"" + prefillProduct + "\")").first();
	}

	if (possibleOptionElement.length > 0)
	{
		$('#product_id').val(possibleOptionElement.val());
		$('#product_id').data('combobox').refresh();
		$('#product_id').trigger('change');

		var nextInputElement = $(Grocy.Components.ProductPicker.GetPicker().parent().data('next-input-selector').toString());
		nextInputElement.focus();
	}
}

var prefillProductId = GetUriParam("product");
var prefillProductId2 = Grocy.Components.ProductPicker.GetPicker().parent().data('prefill-by-id').toString();
if (!prefillProductId2.isEmpty())
{
	prefillProductId = prefillProductId2;
}
if (typeof prefillProductId !== "undefined")
{
	$('#product_id').val(prefillProductId);
	$('#product_id').data('combobox').refresh();
	$('#product_id').trigger('change');

	var nextInputElement = $(Grocy.Components.ProductPicker.GetPicker().parent().data('next-input-selector').toString());
	nextInputElement.focus();
}

var addBarcode = GetUriParam('addbarcodetoselection');
if (addBarcode !== undefined)
{
	$('#addbarcodetoselection').text(addBarcode);
	$('#flow-info-addbarcodetoselection').removeClass('d-none');
	$('#barcode-lookup-disabled-hint').removeClass('d-none');
}

Grocy.Components.ProductPicker.PopupOpen = false;
$('#product_id_text_input').on('blur', function(e)
{
	if (Grocy.Components.ProductPicker.GetPicker().hasClass("combobox-menu-visible"))
	{
		return;	
	}

	var input = $('#product_id_text_input').val().toString();
	var possibleOptionElement = $("#product_id option[data-additional-searchdata*=\"" + input + "\"]").first();
	
	if (GetUriParam('addbarcodetoselection') === undefined && possibleOptionElement.length > 0)
	{
		$('#product_id').val(possibleOptionElement.val());
		$('#product_id').data('combobox').refresh();
		$('#product_id').trigger('change');
	}
	else
	{
		if (Grocy.Components.ProductPicker.PopupOpen === true)
		{
			return;
		}

		var optionElement = $("#product_id option:contains(\"" + input + "\")").first();
		if (input.length > 0 && optionElement.length === 0 && typeof GetUriParam('addbarcodetoselection') === "undefined")
		{
			var addProductWorkflowsAdditionalCssClasses = "";
			if (Grocy.Components.ProductPicker.GetPicker().parent().data('disallow-add-product-workflows').toString() === "true")
			{
				addProductWorkflowsAdditionalCssClasses = "d-none";
			}

			Grocy.Components.ProductPicker.PopupOpen = true;
			bootbox.dialog({
				message: __t('"%s" could not be resolved to a product, how do you want to proceed?', input),
				title: __t('Create or assign product'),
				onEscape: function()
				{
					Grocy.Components.ProductPicker.PopupOpen = false;
					Grocy.Components.ProductPicker.SetValue('');
				},
				size: 'large',
				backdrop: true,
				buttons: {
					cancel: {
						label: __t('Cancel'),
						className: 'btn-secondary responsive-button',
						callback: function()
						{
							Grocy.Components.ProductPicker.PopupOpen = false;
							Grocy.Components.ProductPicker.SetValue('');
						}
					},
					addnewproduct: {
						label: '<strong>P</strong> ' + __t('Add as new product'),
						className: 'btn-success add-new-product-dialog-button responsive-button ' + addProductWorkflowsAdditionalCssClasses,
						callback: function()
						{
							Grocy.Components.ProductPicker.PopupOpen = false;
							window.location.href = U('/product/new?prefillname=' + encodeURIComponent(input) + '&returnto=' + encodeURIComponent(Grocy.CurrentUrlRelative));
						}
					},
					addbarcode: {
						label: '<strong>B</strong> ' + __t('Add as barcode to existing product'),
						className: 'btn-info add-new-barcode-dialog-button responsive-button',
						callback: function()
						{
							Grocy.Components.ProductPicker.PopupOpen = false;
							window.location.href = U(Grocy.CurrentUrlRelative + '?addbarcodetoselection=' + encodeURIComponent(input));
						}
					},
					addnewproductwithbarcode: {
						label: '<strong>A</strong> ' + __t('Add as new product and prefill barcode'),
						className: 'btn-warning add-new-product-with-barcode-dialog-button responsive-button ' + addProductWorkflowsAdditionalCssClasses,
						callback: function()
						{
							Grocy.Components.ProductPicker.PopupOpen = false;
							window.location.href = U('/product/new?prefillbarcode=' + encodeURIComponent(input) + '&returnto=' + encodeURIComponent(Grocy.CurrentUrlRelative));
						}
					}
				}
			}).on('keypress', function(e)
			{
				if (e.key === 'B' || e.key === 'b')
				{
					$('.add-new-barcode-dialog-button').not(".d-none").click();
				}
				if (e.key === 'p' || e.key === 'P')
				{
					$('.add-new-product-dialog-button').not(".d-none").click();
				}
				if (e.key === 'a' || e.key === 'A')
				{
					$('.add-new-product-with-barcode-dialog-button').not(".d-none").click();
				}
			});
		}
	}
});

$("#product_id_text_input")
	.next(".input-group-append")
	.append($("<span>").addClass("input-group-text barcode-read-trigger").append(
		$("<i>").addClass("fas fa-barcode"),
		$("<div>").addClass("barcode-scrim").append($("<div>").addClass("barcode-preview"))
	));

$('.barcode-read-trigger').on('click', function(){
	$(this).find('.barcode-scrim').fadeIn(400, function(){
		$(this).on("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			$(this).fadeOut();
			Quagga.stop();
		});
	});
	console.log($(this).find('.barcode-preview')[0]);
	Quagga.init({
		inputStream : {
			name : "Live",
			type : "LiveStream",
			target: $(this).find('.barcode-preview')[0],
			constraints: {
				facingMode: 'environment'
			}
		},
		decoder : {
			readers : [
				// "upc_e_reader",
				"ean_reader"
			]
		},
		debug: {
			showCanvas: true,
			showPatches: true,
			showFoundPatches: true,
			showSkeleton: true,
			showLabels: true,
			showPatchLabels: true,
			showRemainingPatchLabels: true,
			boxFromPatches: {
				showTransformed: true,
				showTransformedBox: true,
				showBB: true
			}
		}
	}, function(err) {
		if (err) {
			console.log(err);
			return
		}
		console.log("Initialization finished. Ready to start");

		Quagga.start();
	});
	Quagga.onProcessed(function (result) {
		var drawingCtx = Quagga.canvas.ctx.overlay,
			drawingCanvas = Quagga.canvas.dom.overlay;

		if (result) {
			if (result.boxes) {
				drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
				result.boxes.filter(function (box) {
					return box !== result.box;
				}).forEach(function (box) {
					Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
				});
			}

			if (result.box) {
				Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
			}

			if (result.codeResult && result.codeResult.code) {
				Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
			}
		}
	});
	window.readCode = null;
	window.readCodeTimes = 0;
	Quagga.onDetected(function(data){
		console.log(data.codeResult.code);
		$("#result").remove();
		$(document.body).append($("<div id='result'>").text(data.codeResult.code));
		if(window.readCode === data.codeResult.code){
			window.readCodeTimes += 1;
		}
		else{
			window.readCode = data.codeResult.code;
			window.readCodeTimes = 0;
		}
		if(window.readCodeTimes > 9){
			window.navigator.vibrate(200);
			$("#product_id_text_input").val(data.codeResult.code);
				$("#product_id_text_input").blur();
				Quagga.stop();
				$(".barcode-scrim").fadeOut();
		}
		// alert("Found");
		// if(data) {
		// 	$("#product_id_text_input").val(data.codeResult.code);
		// 	$("#product_id_text_input").blur();
		// 	Quagga.stop();
		// 	$(".barcode-scrim").fadeOut();
		// }
	});
});