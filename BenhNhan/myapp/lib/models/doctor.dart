class DoctorModel {
  final int id;
  final String fullName; 
  final int specialtyId;
  final String avatarUrl;
  final String bio;
  final String degree;
  final double rating;
  final String specialtyName;

  DoctorModel({required this.id, required this.fullName, required this.specialtyId, required this.avatarUrl, required this.bio, required this.degree, required this.rating, required this.specialtyName});

  factory DoctorModel.fromJson(Map<String, dynamic> json) {
    return DoctorModel(
      id: json['id'],
      fullName: json['fullName'],
      specialtyId: json['specialtyId'],
      avatarUrl: json['avatarUrl'] ?? '',
      bio: json['bio'] ?? '',
      degree: json['degree'] ?? '',
      rating: (json['rating'] ?? 0.0).toDouble(),
      specialtyName: json['specialtyName'] ?? '',
    );
  }
}