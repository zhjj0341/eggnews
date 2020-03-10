<form method="POST" action="/users?_csrf={{ ctx.csrf | safe }}" enctype="multipart/form-data">
  type: <input name="type" type="radio" value="1" checked/>普通用户 <input name="type" type="radio" value="2" />管理员<br>
  name: <input name="name" /><br>
  password: <input name="pass" /><br>
  <button type="submit">post</button>
</form>