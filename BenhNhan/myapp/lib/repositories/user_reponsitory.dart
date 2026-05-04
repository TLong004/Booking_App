import 'package:myapp/models/user.dart';
import 'package:myapp/services/auth_service.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AuthReponsitory {
  final AuthService _authService = AuthService();
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;

  Future<UserModel> getUser(String email, String password) async {
    UserCredential userCredential = await _firebaseAuth.signInWithEmailAndPassword(email: email, password: password);
    
    String? token = await userCredential.user?.getIdToken();
    if (token == null) throw Exception('Không thể lấy xác thực từ Firebase');

    final response = await _authService.authWithFirebase(token);
    return UserModel.fromJson(response);
  }

  Future<void> registerUser(String fullName, String email, String password, String phone) async {
    UserCredential userCredential = await _firebaseAuth.createUserWithEmailAndPassword(email: email, password: password);

    String? token = await userCredential.user?.getIdToken();
    if (token == null) throw Exception('Không thể lấy xác thực từ Firebase');

    await _authService.authWithFirebase(token, fullName: fullName, phone: phone);
  }

  Future<void> resetPassword(String email) async {
    await _firebaseAuth.sendPasswordResetEmail(email: email);
  }

  Future<void> signOut() async {
    await _firebaseAuth.signOut();
  }
}