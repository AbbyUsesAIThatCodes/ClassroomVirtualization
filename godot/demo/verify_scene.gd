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
	print("GODOT_OK: native scene instantiated; 47 collision shapes; 6 game anchors")
	call_deferred("finish", instance)

func finish(instance: Node) -> void:
	instance.queue_free()
	quit(0)
