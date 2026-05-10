import 'package:myapp/models/appointment.dart';
import 'package:myapp/services/booking_service.dart';

class AppointmentRepository {
  final BookingService _bookingService = BookingService();

  Future<List<AppointmentModel>> getBookings() async {
    try {
      return await _bookingService.getBookings();
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<void> cancelBooking(int id, String cancelReason) async {
    try {
      await _bookingService.cancelBooking(id, cancelReason);
    } catch (e) {
      throw Exception(e.toString());
    }
  }
}
