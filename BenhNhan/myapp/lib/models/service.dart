class ServiceModel {
  final int id;
  final int specialtyId;
  final String name;
  final String description;
  final double price;

  ServiceModel({required this.id, required this.specialtyId, required this.name, required this.description, required this.price});

  factory ServiceModel.fromJson(Map<String, dynamic> json) {
    return ServiceModel(
      id: json['id'] as int,
      specialtyId: (json['specialtyId'] as int?) ?? 0,
      name: json['name'] as String,
      description: (json['description'] as String?) ?? '',
      price: (json['price'] as num).toDouble(),
    );
  }
}