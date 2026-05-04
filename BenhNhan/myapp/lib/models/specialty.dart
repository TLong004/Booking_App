class SpecialtyModel {
  final int? id;
  final String name;
  final String? description;
  final String? iconUrl;
  final int? headDoctorId;

  SpecialtyModel({
    this.id,
    required this.name,
    this.description,
    this.iconUrl,
    this.headDoctorId,
  });

  factory SpecialtyModel.fromJson(Map<String, dynamic> json) {
    return SpecialtyModel(
      id: json['id'],
      name: json['name'] ?? '',
      description: json['description'],
      iconUrl: json['iconUrl'],
      headDoctorId: json['headDoctorId'],
    );
  }
}