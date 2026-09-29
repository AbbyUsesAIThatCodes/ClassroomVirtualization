extends CharacterBody3D
## Demo-only controller. classroom/classroom.tscn has no player or input dependencies.

@export var walk_speed: float = 1.8
@export var run_speed: float = 3.2
@export var mouse_sensitivity: float = 0.0025
@onready var camera: Camera3D = $Camera3D
var pitch: float = 0.0

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
	if event is InputEventKey and event.pressed:
		if event.keycode == KEY_ESCAPE:
			Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
		if event.keycode == KEY_R:
			position = Vector3(0, 0.05, 4.35)
			rotation.y = 0.0
			pitch = 0.0
			camera.rotation.x = 0.0
			velocity = Vector3.ZERO
	if event is InputEventMouseMotion and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
		rotate_y(-event.relative.x * mouse_sensitivity)
		pitch = clampf(pitch - event.relative.y * mouse_sensitivity, -1.38, 1.38)
		camera.rotation.x = pitch

func _physics_process(delta: float) -> void:
	var input := Vector2.ZERO
	if get_window().has_focus():
		input.x = float(Input.is_physical_key_pressed(KEY_D) or Input.is_physical_key_pressed(KEY_RIGHT)) - float(Input.is_physical_key_pressed(KEY_A) or Input.is_physical_key_pressed(KEY_LEFT))
		input.y = float(Input.is_physical_key_pressed(KEY_S) or Input.is_physical_key_pressed(KEY_DOWN)) - float(Input.is_physical_key_pressed(KEY_W) or Input.is_physical_key_pressed(KEY_UP))
	input = input.normalized()
	var direction := transform.basis * Vector3(input.x, 0, input.y)
	var speed := run_speed if Input.is_physical_key_pressed(KEY_SHIFT) else walk_speed
	velocity.x = direction.x * speed
	velocity.z = direction.z * speed
	if not is_on_floor():
		velocity.y -= 9.8 * delta
	else:
		velocity.y = 0
	move_and_slide()
