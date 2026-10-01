extends RichTextLabel

func _ready() -> void:
	if FileAccess.file_exists("res://build-manifest.json"):
		var manifest = JSON.parse_string(FileAccess.get_file_as_string("res://build-manifest.json"))
		text = manifest.id
	else:
		text = "Live Development — Unpackaged"
