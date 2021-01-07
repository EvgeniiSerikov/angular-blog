import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params} from "@angular/router";
import {PostsService} from "../../shared/posts.service";
import {switchMap} from "rxjs/operators";
import {Post} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  post: Post
  updSub: Subscription
  submitted: boolean = false

  constructor(
    private router: ActivatedRoute,
    private postsService: PostsService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.router.params.pipe(
      switchMap((params: Params)=> {
        return this.postsService.getById(params.id)
      })
    ).subscribe((post: Post) => {
      this.post = post
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required)
      })
    })
  }

  submit() {
    if (this.form.invalid) {
      return
    }

    this.submitted = true
    this.updSub = this.postsService.update({
      ...this.post,
      title: this.form.value.title,
      text: this.form.value.text
    }).subscribe(() => {
    this.submitted = false
      this.alert.success("Пост обновлен!")
    })
  }

  ngOnDestroy(): void {
    if (this.updSub) {
      this.updSub.unsubscribe()
    }
  }
}
