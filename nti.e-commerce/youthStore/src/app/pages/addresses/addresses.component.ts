import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css'
})
export class AddressesComponent implements OnInit {
  userService = inject(UserService);

  addresses: any[] = [];
  showForm = false;
  newAddr = { alias: '', details: '', phone: '' };

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.userService.getMe().subscribe(res => {
      this.addresses = res.data.user.addresses;
    });
  }

  saveAddress() {
    this.userService.addAddress(this.newAddr).subscribe(res => {
      this.addresses = res.data.addresses;
      this.showForm = false;
      this.newAddr = { alias: '', details: '', phone: '' };
    });
  }

  setDefault(id: string) {
    this.userService.setDefaultAddress(id).subscribe(res => {
      this.addresses = res.data.addresses;
    });
  }

  deleteAddress(id: string) {
    if (confirm('Delete this address?')) {
      this.userService.deleteAddress(id).subscribe(res => {
        this.addresses = res.data.addresses;
      });
    }
  }
}
