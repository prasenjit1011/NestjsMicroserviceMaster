using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddSingleton<DataService>();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/admin/login";
        options.AccessDeniedPath = "/admin/login";
    });
builder.Services.AddAuthorization();

var app = builder.Build();

// Add static file middleware
app.UseStaticFiles();

// Add authentication middleware
app.UseAuthentication();
app.UseAuthorization();

// Home page
app.MapGet("/", () => 
{
    var html = $@"
<!DOCTYPE html>
<html>
<head>
    <title>Hello World from .NET in Docker</title>
    <link rel=""stylesheet"" href=""/css/home.css"">
</head>
<body>
    <a href='/admin/login' class='admin-link'>👤 Admin Login</a>
    <div class='container'>
        <h1>🎉 Hello World from .NET in Docker! 🎉</h1>
        <div class='docker-logo'>🐳</div>
        <p><strong>Current time:</strong> {DateTime.Now:yyyy-MM-dd HH:mm:ss}</p>
        <p><strong>Server:</strong> ASP.NET Core 8.0</p>
        <p><strong>Environment:</strong> Docker Container</p>
        <p><strong>Host:</strong> {Environment.MachineName}</p>
    </div>
</body>
</html>";
    
    return Results.Content(html, "text/html");
});

// Admin Login Page
app.MapGet("/admin/login", (HttpContext context) =>
{
    var error = context.Request.Query["error"].ToString();
    var errorMessage = error == "invalid" ? "<div class='error'>❌ Invalid username or password!</div>" : "";
    
    var html = $@"
<!DOCTYPE html>
<html>
<head>
    <title>Admin Login</title>
    <link rel=""stylesheet"" href=""/css/login.css"">
</head>
<body>
    <div class='login-container'>
        <h2 style='text-align: center; margin-bottom: 30px;'>🔐 Admin Login</h2>
        {errorMessage}
        <form method='post' action='/admin/login'>
            <div class='form-group'>
                <label for='username'>Username:</label>
                <input type='text' id='username' name='username' placeholder='Enter username' required>
            </div>
            <div class='form-group'>
                <label for='password'>Password:</label>
                <input type='password' id='password' name='password' placeholder='Enter password' required>
            </div>
            <button type='submit' class='btn'>Login</button>
        </form>
        <div class='back-link'>
            <a href='/'>← Back to Home</a>
        </div>
        <div style='margin-top: 30px; text-align: center; font-size: 14px; color: rgba(255,255,255,0.6);'>
            <p>Demo credentials:</p>
            <p>Username: <strong>admin</strong></p>
            <p>Password: <strong>password123</strong></p>
        </div>
    </div>
</body>
</html>";
    
    return Results.Content(html, "text/html");
});

// Admin Login Post
app.MapPost("/admin/login", async (HttpContext context) =>
{
    // Read form data
    var form = await context.Request.ReadFormAsync();
    var username = form["username"].ToString();
    var password = form["password"].ToString();
    
    // Simple authentication (in production, use proper password hashing)
    if (username == "admin" && password == "password123")
    {
        var claims = new List<Claim>
        {
            new("username", username),
            new("role", "admin")
        };
        
        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
        
        return Results.Redirect("/admin/dashboard");
    }
    return Results.Redirect("/admin/login?error=invalid");
});

// Admin Dashboard
app.MapGet("/admin/dashboard", async (DataService dataService) =>
{
    var users = await dataService.GetUsersAsync();
    var userRows = string.Join("", users.Select(u => $@"
        <tr>
            <td>{u.Id}</td>
            <td>{u.Name}</td>
            <td>{u.Email}</td>
            <td>{u.Role}</td>
            <td>{u.Department}</td>
            <td>{u.JoinDate:yyyy-MM-dd}</td>
            <td><span class='status status-{u.Status.ToLower()}'>{u.Status}</span></td>
            <td>
                <button onclick='editUser({u.Id})' class='btn btn-edit'>Edit</button>
                <button onclick='deleteUser({u.Id})' class='btn btn-delete'>Delete</button>
            </td>
        </tr>"));

    var html = $@"
<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
    <link rel=""stylesheet"" href=""/css/dashboard.css"">
</head>
<body>
    <div class='header'>
        <h1>👑 Admin Dashboard</h1>
        <a href='/admin/logout' class='logout-btn'>Logout</a>
    </div>
    
    <div class='stats'>
        <div class='stat-card'>
            <div class='stat-number'>{users.Count}</div>
            <div>Total Users</div>
        </div>
        <div class='stat-card'>
            <div class='stat-number'>{users.Count(u => u.Status == "Active")}</div>
            <div>Active Users</div>
        </div>
        <div class='stat-card'>
            <div class='stat-number'>{users.GroupBy(u => u.Department).Count()}</div>
            <div>Departments</div>
        </div>
        <div class='stat-card'>
            <div class='stat-number'>{users.Count(u => u.JoinDate >= DateTime.Now.AddMonths(-1))}</div>
            <div>New This Month</div>
        </div>
    </div>
    
    <div class='table-container'>
        <div style='display: flex; justify-content: space-between; align-items: center;'>
            <h2>User Management</h2>
            <button onclick='addUser()' class='btn btn-primary'>+ Add User</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {userRows}
            </tbody>
        </table>
    </div>

    <script src=""/js/dashboard.js""></script>
</body>
</html>";
    
    return Results.Content(html, "text/html");
}).RequireAuthorization();

// Admin Logout
app.MapGet("/admin/logout", async (HttpContext context) =>
{
    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.Redirect("/");
});

// API endpoints for user management
app.MapGet("/api/users", async (DataService dataService) =>
{
    return await dataService.GetUsersAsync();
}).RequireAuthorization();

app.MapGet("/api/users/{id:int}", async (DataService dataService, int id) =>
{
    var user = await dataService.GetUserByIdAsync(id);
    return user != null ? Results.Ok(user) : Results.NotFound();
}).RequireAuthorization();

app.MapPost("/api/users", async (DataService dataService, User user) =>
{
    var success = await dataService.AddUserAsync(user);
    return success ? Results.Ok() : Results.BadRequest();
}).RequireAuthorization();

app.MapPut("/api/users/{id:int}", async (DataService dataService, int id, User user) =>
{
    user.Id = id;
    var success = await dataService.UpdateUserAsync(user);
    return success ? Results.Ok() : Results.BadRequest();
}).RequireAuthorization();

app.MapDelete("/api/users/{id:int}", async (DataService dataService, int id) =>
{
    var success = await dataService.DeleteUserAsync(id);
    return success ? Results.Ok() : Results.NotFound();
}).RequireAuthorization();

// Original API endpoint
app.MapGet("/api/hello", () => new { 
    Message = "Hello World from .NET in Docker!", 
    Timestamp = DateTime.Now,
    Environment = "Docker Container",
    MachineName = Environment.MachineName
});

app.Run();
