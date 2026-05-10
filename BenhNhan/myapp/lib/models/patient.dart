class PatientModel {
  final int? id;
  final String fullName;
  final String dob;
  final String gender;
  final String address;
  final String phoneNumber;
  final String cccd;
  final bool isSelf; 

  PatientModel({
    this.id,
    required this.fullName,
    required this.dob,
    required this.gender,
    required this.address,
    required this.phoneNumber,
    required this.cccd,
    this.isSelf = false,
  });

  factory PatientModel.fromJson(Map<String, dynamic> json) {
    // LocalDate từ Java có thể trả về dạng [yyyy, mm, dd] nếu chưa config Jackson
    String parseDob(dynamic raw) {
      if (raw == null) return '';
      if (raw is String) return raw;
      if (raw is List && raw.length == 3) {
        return '${raw[0]}-${raw[1].toString().padLeft(2, '0')}-${raw[2].toString().padLeft(2, '0')}';
      }
      return raw.toString();
    }

    return PatientModel(
      id: json['id'],
      fullName: json['fullName'] ?? '',
      dob: parseDob(json['dob']),
      gender: json['gender'] ?? 'Nam',
      address: json['address'] ?? '',
      phoneNumber: json['phoneNumber'] ?? '',
      cccd: json['cccd'] ?? '',
      isSelf: json['isOwner'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "fullName": fullName,
      "dob": dob,
      "gender": gender,
      "address": address,
      "phoneNumber": phoneNumber,
      "cccd": cccd,
    };
  }
}