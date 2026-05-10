class AppointmentModel {
  final int id;
  final String appointmentDate;
  final String status;
  final String symptoms;
  final String? cancelReason;
  final AppointmentPatient patient;
  final AppointmentDoctor doctor;
  final AppointmentSchedule schedule;

  AppointmentModel({
    required this.id,
    required this.appointmentDate,
    required this.status,
    required this.symptoms,
    this.cancelReason,
    required this.patient,
    required this.doctor,
    required this.schedule,
  });

  factory AppointmentModel.fromJson(Map<String, dynamic> json) {
    return AppointmentModel(
      id: json['id'],
      appointmentDate: json['appointmentDate'] ?? '',
      status: json['status'] ?? '',
      symptoms: json['symptoms'] ?? '',
      cancelReason: json['cancelReason'],
      patient: AppointmentPatient.fromJson(json['patient']),
      doctor: AppointmentDoctor.fromJson(json['doctor']),
      schedule: AppointmentSchedule.fromJson(json['schedule']),
    );
  }
}

class AppointmentPatient {
  final int id;
  final String fullName;
  final bool isOwner;

  AppointmentPatient({required this.id, required this.fullName, required this.isOwner});

  factory AppointmentPatient.fromJson(Map<String, dynamic> json) {
    return AppointmentPatient(
      id: json['id'],
      fullName: json['fullName'] ?? '',
      isOwner: json['isOwner'] ?? false,
    );
  }
}

class AppointmentDoctor {
  final int id;
  final String fullName;
  final String avatarUrl;

  AppointmentDoctor({required this.id, required this.fullName, required this.avatarUrl});

  factory AppointmentDoctor.fromJson(Map<String, dynamic> json) {
    return AppointmentDoctor(
      id: json['id'],
      fullName: json['fullName'] ?? '',
      avatarUrl: json['avatarUrl'] ?? '',
    );
  }
}

class AppointmentSchedule {
  final String startTime;
  final String endTime;

  AppointmentSchedule({required this.startTime, required this.endTime});

  factory AppointmentSchedule.fromJson(Map<String, dynamic> json) {
    return AppointmentSchedule(
      startTime: json['startTime'] ?? '',
      endTime: json['endTime'] ?? '',
    );
  }

  String get displayTime {
    String fmt(String t) => t.length >= 5 ? t.substring(0, 5) : t;
    return "${fmt(startTime)} - ${fmt(endTime)}";
  }
}
