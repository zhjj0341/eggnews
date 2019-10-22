<form method="POST" action="/users?_csrf={{ ctx.csrf | safe }}" enctype="multipart/form-data">
  name: <input name="name" />
  age: <input name="age" />
  <button type="submit">post</button>
</form>