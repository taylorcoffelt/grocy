@push('componentScripts')
	<script src="{{ $U('/node_modules/quagga/dist/quagga.js?v=', true) }}{{ $version }}"></script>
	<script src="{{ $U('/viewjs/components/productpicker.js', true) }}?v={{ $version }}"></script>
@endpush

@php if(empty($disallowAddProductWorkflows)) { $disallowAddProductWorkflows = false; } @endphp
@php if(empty($prefillByName)) { $prefillByName = ''; } @endphp
@php if(empty($prefillById)) { $prefillById = ''; } @endphp
@php if(!isset($isRequired)) { $isRequired = true; } @endphp

<div class="form-group" data-next-input-selector="{{ $nextInputSelector }}" data-disallow-add-product-workflows="{{ BoolToString($disallowAddProductWorkflows) }}" data-prefill-by-name="{{ $prefillByName }}" data-prefill-by-id="{{ $prefillById }}">
	<label for="product_id">{{ $__t('Product') }} <i class="fas fa-barcode"></i><span id="barcode-lookup-disabled-hint" class="small text-muted d-none"> {{ $__t('Barcode lookup is disabled') }}</span></label>
	<select class="form-control product-combobox" id="product_id" name="product_id" @if($isRequired) required @endif>
		<option value=""></option>
		@foreach($products as $product)
			<option data-additional-searchdata="{{ $product->barcode }}" value="{{ $product->id }}">{{ $product->name }}</option>
		@endforeach
	</select>
	<div class="invalid-feedback">{{ $__t('You have to select a product') }}</div>
	<div id="custom-productpicker-error" class="form-text text-danger d-none"></div>
	<div class="form-text text-info small">{{ $__t('Type a new product name or barcode and hit TAB to start a workflow') }}</div>
	<div id="flow-info-addbarcodetoselection" class="form-text text-muted small d-none"><strong><span id="addbarcodetoselection"></span></strong> {{ $__t('will be added to the list of barcodes for the selected product on submit') }}</div>
</div>
