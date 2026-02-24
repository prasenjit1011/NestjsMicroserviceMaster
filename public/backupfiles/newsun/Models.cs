public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public DateTime JoinDate { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class AdminCredentials
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class DataService
{
    private readonly string _dataFilePath = "data.json";
    
    public async Task<List<User>> GetUsersAsync()
    {
        try
        {
            if (!File.Exists(_dataFilePath))
                return new List<User>();
                
            var json = await File.ReadAllTextAsync(_dataFilePath);
            return System.Text.Json.JsonSerializer.Deserialize<List<User>>(json) ?? new List<User>();
        }
        catch
        {
            return new List<User>();
        }
    }
    
    public async Task SaveUsersAsync(List<User> users)
    {
        try
        {
            var json = System.Text.Json.JsonSerializer.Serialize(users, new System.Text.Json.JsonSerializerOptions 
            { 
                WriteIndented = true 
            });
            await File.WriteAllTextAsync(_dataFilePath, json);
        }
        catch
        {
            // Handle error silently for demo
        }
    }
    
    public async Task<User?> GetUserByIdAsync(int id)
    {
        var users = await GetUsersAsync();
        return users.FirstOrDefault(u => u.Id == id);
    }
    
    public async Task<bool> AddUserAsync(User user)
    {
        try
        {
            var users = await GetUsersAsync();
            user.Id = users.Any() ? users.Max(u => u.Id) + 1 : 1;
            users.Add(user);
            await SaveUsersAsync(users);
            return true;
        }
        catch
        {
            return false;
        }
    }
    
    public async Task<bool> UpdateUserAsync(User user)
    {
        try
        {
            var users = await GetUsersAsync();
            var existingUser = users.FirstOrDefault(u => u.Id == user.Id);
            if (existingUser == null) return false;
            
            existingUser.Name = user.Name;
            existingUser.Email = user.Email;
            existingUser.Role = user.Role;
            existingUser.Department = user.Department;
            existingUser.JoinDate = user.JoinDate;
            existingUser.Status = user.Status;
            
            await SaveUsersAsync(users);
            return true;
        }
        catch
        {
            return false;
        }
    }
    
    public async Task<bool> DeleteUserAsync(int id)
    {
        try
        {
            var users = await GetUsersAsync();
            var user = users.FirstOrDefault(u => u.Id == id);
            if (user == null) return false;
            
            users.Remove(user);
            await SaveUsersAsync(users);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
