extends SceneTree

func _initialize() -> void:
	var packed: PackedScene = load("res://demo/walkthrough.tscn")
	if packed == null:
		push_error("Walkthrough did not load")
		quit(1)
		return
	var instance := packed.instantiate()
	root.add_child(instance)
	var room := instance.get_node("Classroom")
	assert(room.get_node("Collisions").get_child_count() == 44)
	assert(room.get_node("Anchors").get_child_count() == 6)
	assert(room.get_node("Anchors/GameAnchor_Lever").position.is_equal_approx(Vector3(-2.24, 0.983, 0.3)))
	assert(room.get_node("Anchors/GameAnchor_Design").position.is_equal_approx(Vector3(0.4975, 0.9325, 0)))
	assert(room.get_node("Model").find_child("QuotePoster_38", true, false) != null)
	assert(room.get_node("Model").find_child("ExitPushBar", true, false) != null)
	print("GODOT_OK: native scene instantiated; 44 collision shapes; 6 game anchors; poster 38 and push bar present")
	call_deferred("finish", instance)

func finish(instance: Node) -> void:
	var manifest = JSON.parse_string(FileAccess.get_file_as_string("res://build-manifest.json"))
	assert(instance.get_node("Interface/BuildIdentity").text == manifest.id)
	print("GODOT_BUILD_ID: ", manifest.id)
	instance.queue_free()
	quit(0)
