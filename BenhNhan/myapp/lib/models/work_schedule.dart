class WorkScheduleModel {
  final int id;
  final String workDate;
  final String startTime;
  final String endTime;
  final bool isAvailable;

  WorkScheduleModel({
    required this.id,
    required this.workDate,
    required this.startTime,
    required this.endTime,
    required this.isAvailable,
  });

  factory WorkScheduleModel.fromJson(Map<String, dynamic> json) {
    return WorkScheduleModel(
      id: json['id'],
      workDate: json['workDate'],
      startTime: json['startTime'],
      endTime: json['endTime'],
      isAvailable: json['isAvailable'] ?? false,
    );
  }
}