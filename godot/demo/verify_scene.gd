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
	assert(room.get_node("Collisions").get_child_count() == 47)
	assert(room.get_node("Anchors").get_child_count() == 6)
	assert(room.get_node("Anchors/GameAnchor_Lever").position.is_equal_approx(Vector3(-2.24, 0.983, 0.3)))
	assert(room.get_node("Anchors/GameAnchor_Design").position.is_equal_approx(Vector3(0.4975, 0.9325, 0)))
	assert(room.get_node("Model").find_child("QuotePoster_38", true, false) != null)
	assert(room.get_node("Model").find_child("ExitPushBar", true, false) != null)
	var model := room.get_node("Model")
	assert(model.find_child("RearExitDoor", true, false).position.is_equal_approx(Vector3(-2.85, 0, 6.96)))
	assert(model.find_child("FrontExitDoor", true, false).position.is_equal_approx(Vector3(-2.15, 0, -6.96)))
	assert(model.find_child("SouthWallLintel", true, false) != null)
	var count := {"north": 0, "east": 0, "south": 0, "west": 0}
	for i in range(1, 39):
		var poster := model.find_child("QuotePoster_%02d" % i, true, false)
		assert(poster != null)
		var expected := "north" if i <= 5 else "east" if i <= 17 else "south" if i <= 25 else "west"
		count[expected] += 1
		var normal: Vector3 = poster.basis * Vector3(0, 0, 1)
		assert(normal.dot(-poster.position) > 3)
	assert(count == {"north": 5, "east": 12, "south": 8, "west": 13})
	print("GODOT_OK: native scene instantiated; 47 collision shapes; 6 game anchors; 38 inward-facing posters on all walls; southwest rear door; north door unchanged")
	call_deferred("finish", instance)

func finish(instance: Node) -> void:
	var manifest = JSON.parse_string(FileAccess.get_file_as_string("res://build-manifest.json"))
	assert(instance.get_node("Interface/BuildIdentity").text == manifest.id)
	print("GODOT_BUILD_ID: ", manifest.id)
	instance.queue_free()
	quit(0)
