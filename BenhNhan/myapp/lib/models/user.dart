class UserModel {
  final int id;
  final String username;
  final String fullName;
  final String? email;
  final String? phone;
  final String token;

  UserModel({
    required this.id,
    required this.username,
    required this.fullName,
    this.email,
    this.phone,
    required this.token,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      username: json['username'],
      fullName: json['fullName'] ?? '',
      email: json['email'],
      phone: json['phone'],
      token: json['token'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'username': username,
    'fullName': fullName,
    'email': email,
    'phone': phone,
    'token': token,
  };
}