﻿$(document).on('click', '.quantityunit-delete-button', function(e)
{
	bootbox.confirm({
		message: 'Delete quantity unit <strong>' + $(e.target).attr('data-quantityunit-name') + '</strong>?',
		buttons: {
			confirm: {
				label: 'Yes',
				className: 'btn-success'
			},
			cancel: {
				label: 'No',
				className: 'btn-danger'
			}
		},
		callback: function(result)
		{
			if (result === true)
			{
				Grocy.FetchJson('/api/delete-object/quantity_units/' + $(e.target).attr('data-quantityunit-id'),
					function(result)
					{
						window.location.href = '/quantityunits';
					},
					function(xhr)
					{
						console.error(xhr);
					}
				);
			}
		}
	});
});

$(function()
{
	$('#quantityunits-table').DataTable({
		'pageLength': 50,
		'order': [[1, 'asc']],
		'columnDefs': [
			{ 'orderable': false, 'targets': 0 }
		]
	});
});